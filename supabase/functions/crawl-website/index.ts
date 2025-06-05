
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts"

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
  screenshot?: string;
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
          'User-Agent': 'Mozilla/5.0 (compatible; AccessibilityBot/2.0)'
        }
      })
      
      if (!response.ok) {
        console.log(`Failed to fetch ${url}: ${response.status}`)
        continue
      }
      
      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      
      if (!doc) {
        console.log(`Failed to parse HTML for ${url}`)
        continue
      }
      
      // Extract all links
      const links = doc.querySelectorAll('a[href]')
      
      for (const link of links) {
        try {
          const href = link.getAttribute('href')
          if (!href) continue
          
          const linkUrl = new URL(href, url)
          
          // Only include links from the same domain
          if (linkUrl.hostname === baseDomain && 
              !discovered.has(linkUrl.href) && 
              !queue.some(item => item.url === linkUrl.href)) {
            
            // Skip common non-content links
            const pathname = linkUrl.pathname.toLowerCase()
            if (!pathname.includes('/api/') && 
                !pathname.includes('/admin/') && 
                !pathname.endsWith('.pdf') &&
                !pathname.endsWith('.jpg') &&
                !pathname.endsWith('.png') &&
                !pathname.endsWith('.gif')) {
              
              discovered.add(linkUrl.href)
              queue.push({ url: linkUrl.href, depth: depth + 1 })
            }
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

async function crawlPage(url: string): Promise<PageResult> {
  const startTime = Date.now()
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AccessibilityBot/2.0)'
      }
    })
    
    const loadTime = Date.now() - startTime
    
    if (!response.ok) {
      return {
        url,
        title: '',
        statusCode: response.status,
        loadTime,
        issues: []
      }
    }
    
    const html = await response.text()
    const doc = new DOMParser().parseFromString(html, 'text/html')
    
    if (!doc) {
      return {
        url,
        title: '',
        statusCode: response.status,
        loadTime,
        issues: []
      }
    }
    
    // Get page title
    const titleElement = doc.querySelector('title')
    const title = titleElement?.textContent || ''
    
    // Perform enhanced accessibility checks
    const issues = await performAdvancedAccessibilityChecks(doc, url)
    
    return {
      url,
      title: title.trim(),
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

async function performAdvancedAccessibilityChecks(doc: any, url: string): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = []
  
  try {
    // 1. Missing alt text on images
    const images = doc.querySelectorAll('img')
    for (const img of images) {
      if (!img.hasAttribute('alt') || img.getAttribute('alt')?.trim() === '') {
        issues.push({
          ruleId: 'image-alt',
          impact: 'serious',
          description: 'Images must have alternate text',
          helpText: 'Add meaningful alt text to describe the image content',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
          targetElement: img.tagName.toLowerCase(),
          htmlSnippet: img.outerHTML?.substring(0, 200) || ''
        })
      }
    }
    
    // 2. Form labels validation (enhanced)
    const inputs = doc.querySelectorAll('input[type]:not([type="hidden"]):not([type="submit"]):not([type="button"])')
    for (const input of inputs) {
      const hasLabel = input.hasAttribute('aria-label') || 
                      input.hasAttribute('aria-labelledby') ||
                      input.getAttribute('id') && doc.querySelector(`label[for="${input.getAttribute('id')}"]`)
      
      if (!hasLabel) {
        issues.push({
          ruleId: 'label',
          impact: 'critical',
          description: 'Form elements must have labels',
          helpText: 'Add a label element or aria-label attribute',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
          targetElement: input.tagName.toLowerCase(),
          htmlSnippet: input.outerHTML?.substring(0, 200) || ''
        })
      }
    }
    
    // 3. Page title validation
    const titleElement = doc.querySelector('title')
    if (!titleElement || !titleElement.textContent?.trim()) {
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
    
    // 4. Language attribute validation
    const htmlElement = doc.querySelector('html')
    if (!htmlElement?.hasAttribute('lang') || htmlElement.getAttribute('lang')?.trim() === '') {
      issues.push({
        ruleId: 'html-has-lang',
        impact: 'serious',
        description: 'HTML element must have a lang attribute',
        helpText: 'Add lang attribute to the html element',
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
        targetElement: 'html',
        htmlSnippet: htmlElement?.outerHTML?.substring(0, 100) || ''
      })
    }
    
    // 5. Heading structure validation
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const h1Elements = doc.querySelectorAll('h1')
    
    if (h1Elements.length === 0) {
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
    
    // 6. Heading hierarchy validation
    let previousLevel = 0
    for (const heading of headings) {
      const currentLevel = parseInt(heading.tagName.charAt(1))
      if (previousLevel > 0 && currentLevel > previousLevel + 1) {
        issues.push({
          ruleId: 'heading-order',
          impact: 'moderate',
          description: 'Headings should not skip levels',
          helpText: 'Use headings in sequential order (h1, h2, h3, etc.)',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html',
          targetElement: heading.tagName.toLowerCase(),
          htmlSnippet: heading.outerHTML?.substring(0, 200) || ''
        })
      }
      previousLevel = currentLevel
    }
    
    // 7. Skip links validation
    const skipLinks = doc.querySelectorAll('a[href^="#"]')
    const hasSkipToMain = Array.from(skipLinks).some(link => 
      link.textContent?.toLowerCase().includes('skip') ||
      link.textContent?.toLowerCase().includes('main')
    )
    
    if (!hasSkipToMain) {
      issues.push({
        ruleId: 'skip-link',
        impact: 'moderate',
        description: 'Page should have skip navigation links',
        helpText: 'Add a skip link to main content for keyboard users',
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html',
        targetElement: 'body',
        htmlSnippet: '<a href="#main">Skip to main content</a>'
      })
    }
    
    // 8. Button accessibility validation
    const buttons = doc.querySelectorAll('button')
    for (const button of buttons) {
      if (!button.textContent?.trim() && !button.hasAttribute('aria-label')) {
        issues.push({
          ruleId: 'button-name',
          impact: 'serious',
          description: 'Buttons must have accessible names',
          helpText: 'Add text content or aria-label to the button',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
          targetElement: button.tagName.toLowerCase(),
          htmlSnippet: button.outerHTML?.substring(0, 200) || ''
        })
      }
    }
    
    // 9. Link accessibility validation
    const links = doc.querySelectorAll('a[href]')
    for (const link of links) {
      if (!link.textContent?.trim() && !link.hasAttribute('aria-label')) {
        issues.push({
          ruleId: 'link-name',
          impact: 'serious',
          description: 'Links must have accessible names',
          helpText: 'Add text content or aria-label to the link',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
          targetElement: link.tagName.toLowerCase(),
          htmlSnippet: link.outerHTML?.substring(0, 200) || ''
        })
      }
    }
    
    // 10. Color contrast (basic check for commonly problematic patterns)
    const elementsWithInlineStyle = doc.querySelectorAll('*[style]')
    for (const element of elementsWithInlineStyle) {
      const style = element.getAttribute('style') || ''
      if (style.includes('color:') && style.includes('background')) {
        // This is a simplified check - real color contrast would need actual color parsing
        issues.push({
          ruleId: 'color-contrast',
          impact: 'minor',
          description: 'Ensure sufficient color contrast',
          helpText: 'Check that text has sufficient contrast against its background (4.5:1 for normal text)',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
          targetElement: element.tagName.toLowerCase(),
          htmlSnippet: element.outerHTML?.substring(0, 200) || ''
        })
      }
    }
    
  } catch (error) {
    console.error('Error performing accessibility checks:', error)
  }
  
  return issues
}
