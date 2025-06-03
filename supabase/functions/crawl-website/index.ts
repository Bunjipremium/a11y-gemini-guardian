
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

    // Start background crawling task
    performCrawl(supabaseClient, website, scanId)

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
    console.log('Starting background crawl process...')
    
    // Update scan status to running
    await supabaseClient
      .from('scans')
      .update({ 
        status: 'running',
        started_at: new Date().toISOString()
      })
      .eq('id', scanId)

    console.log('Scan status updated to running')

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
        
        const pageResult = await crawlPageBasic(url)
        
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

async function discoverUrls(baseUrl: string, maxDepth: number, maxPages: number): Promise<string[]> {
  const discovered = new Set<string>([baseUrl])
  const queue = [{ url: baseUrl, depth: 0 }]
  const baseDomain = new URL(baseUrl).hostname
  
  while (queue.length > 0 && discovered.size < maxPages) {
    const { url, depth } = queue.shift()!
    
    if (depth >= maxDepth) {
      continue
    }
    
    try {
      console.log(`Discovering links on: ${url} (depth: ${depth})`)
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AccessibilityBot/1.0)'
        }
      })
      
      if (!response.ok) continue
      
      const html = await response.text()
      
      // Extract links using regex
      const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi
      let match
      
      while ((match = linkRegex.exec(html)) !== null) {
        try {
          const href = match[1]
          let fullUrl: string
          
          if (href.startsWith('http')) {
            fullUrl = href
          } else if (href.startsWith('/')) {
            fullUrl = new URL(href, baseUrl).toString()
          } else if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            continue
          } else {
            fullUrl = new URL(href, url).toString()
          }
          
          const linkUrl = new URL(fullUrl)
          
          if (linkUrl.hostname === baseDomain && 
              !discovered.has(fullUrl) && 
              !queue.some(item => item.url === fullUrl)) {
            discovered.add(fullUrl)
            queue.push({ url: fullUrl, depth: depth + 1 })
          }
        } catch (e) {
          // Invalid URL, skip
        }
      }
      
    } catch (error) {
      console.error(`Error discovering links on ${url}:`, error)
    }
  }
  
  return Array.from(discovered).slice(0, maxPages)
}

async function crawlPageBasic(url: string): Promise<PageResult> {
  const startTime = Date.now()
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AccessibilityBot/1.0)'
      }
    })
    
    const loadTime = Date.now() - startTime
    const html = await response.text()
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''
    
    // Basic accessibility checks
    const issues: AccessibilityIssue[] = []
    
    // Check for missing alt text on images
    const imgRegex = /<img[^>]*>/gi
    let imgMatch
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const imgTag = imgMatch[0]
      if (!imgTag.includes('alt=') || imgTag.includes('alt=""') || imgTag.includes("alt=''")) {
        issues.push({
          ruleId: 'image-alt',
          impact: 'serious',
          description: 'Images must have alternate text',
          helpText: 'Add meaningful alt text to describe the image content',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
          targetElement: 'img',
          htmlSnippet: imgTag
        })
      }
    }
    
    // Check for missing form labels
    const inputRegex = /<input[^>]*type=["'](?!hidden|submit|button)[^"']*["'][^>]*>/gi
    let inputMatch
    while ((inputMatch = inputRegex.exec(html)) !== null) {
      const inputTag = inputMatch[0]
      if (!inputTag.includes('aria-label=') && !inputTag.includes('aria-labelledby=')) {
        const idMatch = inputTag.match(/id=["']([^"']*)["']/)
        if (idMatch) {
          const inputId = idMatch[1]
          const labelRegex = new RegExp(`<label[^>]*for=["']${inputId}["'][^>]*>`, 'i')
          if (!labelRegex.test(html)) {
            issues.push({
              ruleId: 'label',
              impact: 'critical',
              description: 'Form elements must have labels',
              helpText: 'Add a label element or aria-label attribute',
              helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
              targetElement: 'input',
              htmlSnippet: inputTag
            })
          }
        }
      }
    }
    
    // Check for missing page title
    if (!title || title.length === 0) {
      issues.push({
        ruleId: 'document-title',
        impact: 'serious',
        description: 'Page must have a title',
        helpText: 'Add a descriptive title element to the page',
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html',
        targetElement: 'title',
        htmlSnippet: '<title></title>'
      })
    }
    
    // Check for missing lang attribute
    if (!html.includes('lang=')) {
      issues.push({
        ruleId: 'html-has-lang',
        impact: 'serious',
        description: 'HTML element must have a lang attribute',
        helpText: 'Add lang attribute to the html element',
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
        targetElement: 'html',
        htmlSnippet: '<html>'
      })
    }
    
    // Check for missing main heading
    if (!/<h1[^>]*>/i.test(html)) {
      issues.push({
        ruleId: 'page-has-heading-one',
        impact: 'moderate',
        description: 'Page should contain a heading',
        helpText: 'Add an h1 element to provide page structure',
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html',
        targetElement: 'h1',
        htmlSnippet: '<h1>Page heading</h1>'
      })
    }
    
    return {
      url,
      title,
      statusCode: response.status,
      loadTime,
      issues
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
