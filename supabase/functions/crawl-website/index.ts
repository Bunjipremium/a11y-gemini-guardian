
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts"
import { AxePuppeteer } from "https://esm.sh/@axe-core/puppeteer@4.8.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CrawlRequest {
  websiteId: string;
  scanId: string;
}

interface PageResult {
  url: string;
  title: string;
  statusCode: number;
  loadTime: number;
  issues: AccessibilityIssue[];
}

interface AccessibilityIssue {
  ruleId: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  helpText?: string;
  helpUrl?: string;
  targetElement?: string;
  htmlSnippet?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { websiteId, scanId }: CrawlRequest = await req.json()
    
    console.log(`Starting crawl for website ${websiteId}, scan ${scanId}`)

    // Get website configuration
    const { data: website, error: websiteError } = await supabaseClient
      .from('websites')
      .select('*')
      .eq('id', websiteId)
      .single()

    if (websiteError || !website) {
      throw new Error(`Website not found: ${websiteError?.message}`)
    }

    // Start background crawling task
    EdgeRuntime.waitUntil(performCrawl(supabaseClient, website, scanId))

    return new Response(
      JSON.stringify({ success: true, message: 'Crawl started in background' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Crawl error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function performCrawl(supabaseClient: any, website: any, scanId: string) {
  try {
    // Update scan status to running
    await supabaseClient
      .from('scans')
      .update({ 
        status: 'running',
        started_at: new Date().toISOString()
      })
      .eq('id', scanId)

    console.log('Launching browser...')
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    })

    try {
      // Discover URLs to crawl
      const urlsToCrawl = await discoverUrls(browser, website.base_url, website.max_depth, website.max_pages)
      
      console.log(`Discovered ${urlsToCrawl.length} URLs to crawl`)

      // Update total pages count
      await supabaseClient
        .from('scans')
        .update({ total_pages: urlsToCrawl.length })
        .eq('id', scanId)

      let totalIssues = 0
      let scannedCount = 0

      // Crawl each URL
      for (const url of urlsToCrawl) {
        try {
          console.log(`Crawling: ${url}`)
          
          const pageResult = await crawlPageWithAxe(browser, url)
          
          // Save scan result
          const { data: scanResult, error: resultError } = await supabaseClient
            .from('scan_results')
            .insert({
              scan_id: scanId,
              url: pageResult.url,
              title: pageResult.title,
              status_code: pageResult.statusCode,
              load_time_ms: pageResult.loadTime,
              total_issues: pageResult.issues.length,
              critical_issues: pageResult.issues.filter(i => i.impact === 'critical').length,
              serious_issues: pageResult.issues.filter(i => i.impact === 'serious').length,
              moderate_issues: pageResult.issues.filter(i => i.impact === 'moderate').length,
              minor_issues: pageResult.issues.filter(i => i.impact === 'minor').length
            })
            .select()
            .single()

          if (resultError) {
            console.error('Error saving scan result:', resultError)
            continue
          }

          // Save accessibility issues
          if (pageResult.issues.length > 0) {
            const issuesData = pageResult.issues.map(issue => ({
              scan_result_id: scanResult.id,
              rule_id: issue.ruleId,
              impact: issue.impact,
              description: issue.description,
              help_text: issue.helpText,
              help_url: issue.helpUrl,
              target_element: issue.targetElement,
              html_snippet: issue.htmlSnippet
            }))

            await supabaseClient
              .from('accessibility_issues')
              .insert(issuesData)
          }

          totalIssues += pageResult.issues.length
          scannedCount++

          // Update progress
          await supabaseClient
            .from('scans')
            .update({ 
              scanned_pages: scannedCount,
              total_issues: totalIssues
            })
            .eq('id', scanId)

          // Rate limiting
          if (website.rate_limit_ms > 0) {
            await new Promise(resolve => setTimeout(resolve, website.rate_limit_ms))
          }

        } catch (error) {
          console.error(`Error crawling ${url}:`, error)
        }
      }

      // Mark scan as completed
      await supabaseClient
        .from('scans')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          scanned_pages: scannedCount,
          total_issues: totalIssues
        })
        .eq('id', scanId)

      console.log(`Crawl completed. Scanned ${scannedCount} pages, found ${totalIssues} issues`)

    } finally {
      await browser.close()
    }

  } catch (error) {
    console.error('Background crawl error:', error)
    
    // Mark scan as failed
    await supabaseClient
      .from('scans')
      .update({ 
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString()
      })
      .eq('id', scanId)
  }
}

async function discoverUrls(browser: any, baseUrl: string, maxDepth: number, maxPages: number): Promise<string[]> {
  const discovered = new Set<string>()
  const queue = [{ url: baseUrl, depth: 0 }]
  const baseDomain = new URL(baseUrl).hostname
  
  const page = await browser.newPage()
  
  try {
    while (queue.length > 0 && discovered.size < maxPages) {
      const { url, depth } = queue.shift()!
      
      if (discovered.has(url) || depth > maxDepth) {
        continue
      }
      
      try {
        console.log(`Discovering links on: ${url} (depth: ${depth})`)
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
        discovered.add(url)
        
        if (depth < maxDepth) {
          // Extract all links
          const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a[href]'))
            return anchors.map(a => (a as HTMLAnchorElement).href)
          })
          
          // Filter and add valid links to queue
          for (const link of links) {
            try {
              const linkUrl = new URL(link)
              if (linkUrl.hostname === baseDomain && 
                  !discovered.has(link) && 
                  !queue.some(item => item.url === link)) {
                queue.push({ url: link, depth: depth + 1 })
              }
            } catch (e) {
              // Invalid URL, skip
            }
          }
        }
        
      } catch (error) {
        console.error(`Error discovering links on ${url}:`, error)
      }
    }
  } finally {
    await page.close()
  }
  
  return Array.from(discovered).slice(0, maxPages)
}

async function crawlPageWithAxe(browser: any, url: string): Promise<PageResult> {
  const startTime = Date.now()
  const page = await browser.newPage()
  
  try {
    // Navigate to page
    const response = await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    })
    
    const loadTime = Date.now() - startTime
    
    // Get page title
    const title = await page.title()
    
    // Run axe accessibility tests
    const axe = new AxePuppeteer(page)
    const results = await axe.analyze()
    
    // Convert axe results to our format
    const issues: AccessibilityIssue[] = []
    
    // Process violations
    for (const violation of results.violations) {
      for (const node of violation.nodes) {
        issues.push({
          ruleId: violation.id,
          impact: violation.impact as 'critical' | 'serious' | 'moderate' | 'minor',
          description: violation.description,
          helpText: violation.help,
          helpUrl: violation.helpUrl,
          targetElement: node.target.join(', '),
          htmlSnippet: node.html
        })
      }
    }
    
    await page.close()
    
    return {
      url,
      title,
      statusCode: response?.status() || 0,
      loadTime,
      issues
    }
    
  } catch (error) {
    console.error(`Error crawling ${url}:`, error)
    await page.close()
    
    return {
      url,
      title: '',
      statusCode: 0,
      loadTime: Date.now() - startTime,
      issues: []
    }
  }
}
