
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Update scan status to running
    await supabaseClient
      .from('scans')
      .update({ 
        status: 'running',
        started_at: new Date().toISOString()
      })
      .eq('id', scanId)

    // Discover URLs to crawl
    const urlsToCrawl = await discoverUrls(website.base_url, website.max_depth, website.max_pages)
    
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
        
        const pageResult = await crawlPage(url)
        
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        scannedPages: scannedCount,
        totalIssues: totalIssues 
      }),
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

async function discoverUrls(baseUrl: string, maxDepth: number, maxPages: number): Promise<string[]> {
  const discovered = new Set<string>()
  const queue = [{ url: baseUrl, depth: 0 }]
  
  while (queue.length > 0 && discovered.size < maxPages) {
    const { url, depth } = queue.shift()!
    
    if (discovered.has(url) || depth > maxDepth) {
      continue
    }
    
    discovered.add(url)
    
    // For now, just return the base URL
    // TODO: Implement actual link discovery with Puppeteer
  }
  
  return Array.from(discovered).slice(0, maxPages)
}

async function crawlPage(url: string): Promise<PageResult> {
  const startTime = Date.now()
  
  try {
    // Simulate page crawling for now
    // TODO: Implement actual Puppeteer crawling with axe-core
    
    const response = await fetch(url)
    const html = await response.text()
    const loadTime = Date.now() - startTime
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''
    
    // Simulate accessibility issues
    const mockIssues: AccessibilityIssue[] = [
      {
        ruleId: 'color-contrast',
        impact: 'serious',
        description: 'Elements must have sufficient color contrast',
        helpText: 'Ensure all text elements have a contrast ratio of at least 4.5:1',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.6/color-contrast',
        targetElement: 'button.primary'
      }
    ]
    
    return {
      url,
      title,
      statusCode: response.status,
      loadTime,
      issues: Math.random() > 0.5 ? mockIssues : []
    }
    
  } catch (error) {
    console.error(`Error crawling ${url}:`, error)
    return {
      url,
      title: '',
      statusCode: 0,
      loadTime: Date.now() - startTime,
      issues: []
    }
  }
}
