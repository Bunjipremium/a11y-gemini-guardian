
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { chromium } from 'https://deno.land/x/playwright@1.40.0/mod.ts'

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
  let browser: any = null
  
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

    // Launch browser
    console.log('Launching browser...')
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--memory-pressure-off',
        '--max_old_space_size=100'
      ]
    })

    console.log('Browser launched successfully')

    // Discover URLs to crawl using browser
    const urlsToCrawl = await discoverUrlsWithBrowser(browser, website.base_url, website.max_depth, website.max_pages)
    
    console.log(`Discovered ${urlsToCrawl.length} URLs to crawl`)

    // Update total pages count
    await supabaseClient
      .from('scans')
      .update({ total_pages: urlsToCrawl.length })
      .eq('id', scanId)

    let totalIssues = 0
    let scannedCount = 0

    // Crawl each URL with browser
    for (const url of urlsToCrawl) {
      try {
        console.log(`Crawling: ${url}`)
        
        const pageResult = await crawlPageWithBrowser(browser, url)
        
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
  } finally {
    // Always close browser
    if (browser) {
      try {
        await browser.close()
        console.log('Browser closed successfully')
      } catch (error) {
        console.error('Error closing browser:', error)
      }
    }
  }
}

async function discoverUrlsWithBrowser(browser: any, baseUrl: string, maxDepth: number, maxPages: number): Promise<string[]> {
  const discovered = new Set<string>([baseUrl])
  const queue = [{ url: baseUrl, depth: 0 }]
  const baseDomain = new URL(baseUrl).hostname
  
  let page: any = null
  
  try {
    page = await browser.newPage()
    
    // Configure page settings
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (compatible; AccessibilityBot/2.0)'
    })
    
    while (queue.length > 0 && discovered.size < maxPages) {
      const { url, depth } = queue.shift()!
      
      if (depth >= maxDepth) {
        continue
      }
      
      try {
        console.log(`Discovering links on: ${url} (depth: ${depth})`)
        
        await page.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 30000 
        })
        
        // Wait for any dynamic content to load
        await page.waitForTimeout(1000)
        
        // Extract all links using browser's DOM API
        const links = await page.evaluate(() => {
          const anchors = Array.from(document.querySelectorAll('a[href]'))
          return anchors.map(anchor => (anchor as HTMLAnchorElement).href)
        })
        
        for (const href of links) {
          try {
            const linkUrl = new URL(href)
            
            // Only include links from the same domain
            if (linkUrl.hostname === baseDomain && 
                !discovered.has(href) && 
                !queue.some(item => item.url === href)) {
              
              // Skip common non-content links
              const pathname = linkUrl.pathname.toLowerCase()
              if (!pathname.includes('/api/') && 
                  !pathname.includes('/admin/') && 
                  !pathname.endsWith('.pdf') &&
                  !pathname.endsWith('.jpg') &&
                  !pathname.endsWith('.png') &&
                  !pathname.endsWith('.gif')) {
                
                discovered.add(href)
                queue.push({ url: href, depth: depth + 1 })
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
    
  } finally {
    if (page) {
      await page.close()
    }
  }
  
  return Array.from(discovered).slice(0, maxPages)
}

async function crawlPageWithBrowser(browser: any, url: string): Promise<PageResult> {
  const startTime = Date.now()
  let page: any = null
  
  try {
    page = await browser.newPage()
    
    // Configure page settings
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (compatible; AccessibilityBot/2.0)'
    })
    
    // Navigate to page
    const response = await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    })
    
    const loadTime = Date.now() - startTime
    
    if (!response) {
      throw new Error('No response received')
    }
    
    // Wait for page to be fully rendered
    await page.waitForTimeout(2000)
    
    // Get page title
    const title = await page.title()
    
    // Perform enhanced accessibility checks using browser APIs
    const issues = await performEnhancedAccessibilityChecks(page)
    
    return {
      url,
      title: title || '',
      statusCode: response.status(),
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
  } finally {
    if (page) {
      await page.close()
    }
  }
}

async function performEnhancedAccessibilityChecks(page: any): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = []
  
  try {
    // Enhanced accessibility checks using browser DOM API
    const checkResults = await page.evaluate(() => {
      const results: any[] = []
      
      // Check for missing alt text on images
      const images = document.querySelectorAll('img')
      images.forEach((img, index) => {
        if (!img.hasAttribute('alt') || img.alt.trim() === '') {
          results.push({
            ruleId: 'image-alt',
            impact: 'serious',
            description: 'Images must have alternate text',
            helpText: 'Add meaningful alt text to describe the image content',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
            targetElement: `img:nth-child(${index + 1})`,
            htmlSnippet: img.outerHTML.substring(0, 200)
          })
        }
      })
      
      // Check for missing form labels with enhanced detection
      const inputs = document.querySelectorAll('input[type]:not([type="hidden"]):not([type="submit"]):not([type="button"])')
      inputs.forEach((input, index) => {
        const hasLabel = input.hasAttribute('aria-label') || 
                        input.hasAttribute('aria-labelledby') ||
                        document.querySelector(`label[for="${input.id}"]`) ||
                        input.closest('label')
        
        if (!hasLabel) {
          results.push({
            ruleId: 'label',
            impact: 'critical',
            description: 'Form elements must have labels',
            helpText: 'Add a label element or aria-label attribute',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
            targetElement: `input:nth-child(${index + 1})`,
            htmlSnippet: input.outerHTML.substring(0, 200)
          })
        }
      })
      
      // Check for missing page title
      if (!document.title || document.title.trim().length === 0) {
        results.push({
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
      const htmlElement = document.documentElement
      if (!htmlElement.hasAttribute('lang') || htmlElement.lang.trim() === '') {
        results.push({
          ruleId: 'html-has-lang',
          impact: 'serious',
          description: 'HTML element must have a lang attribute',
          helpText: 'Add lang attribute to the html element',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
          targetElement: 'html',
          htmlSnippet: htmlElement.outerHTML.substring(0, 100)
        })
      }
      
      // Check for missing main heading
      const h1Elements = document.querySelectorAll('h1')
      if (h1Elements.length === 0) {
        results.push({
          ruleId: 'page-has-heading-one',
          impact: 'moderate',
          description: 'Page should contain a heading',
          helpText: 'Add an h1 element to provide page structure',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html',
          targetElement: 'h1',
          htmlSnippet: '<h1>Page heading</h1>'
        })
      }
      
      // Enhanced: Check for missing skip links
      const skipLinks = document.querySelectorAll('a[href^="#"]')
      const hasSkipToMain = Array.from(skipLinks).some(link => 
        link.textContent?.toLowerCase().includes('skip') ||
        link.textContent?.toLowerCase().includes('main')
      )
      
      if (!hasSkipToMain) {
        results.push({
          ruleId: 'skip-link',
          impact: 'moderate',
          description: 'Page should have skip navigation links',
          helpText: 'Add a skip link to main content for keyboard users',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html',
          targetElement: 'body',
          htmlSnippet: '<a href="#main">Skip to main content</a>'
        })
      }
      
      // Enhanced: Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let previousLevel = 0
      
      headings.forEach((heading, index) => {
        const currentLevel = parseInt(heading.tagName.charAt(1))
        if (previousLevel > 0 && currentLevel > previousLevel + 1) {
          results.push({
            ruleId: 'heading-order',
            impact: 'moderate',
            description: 'Headings should not skip levels',
            helpText: 'Use headings in sequential order (h1, h2, h3, etc.)',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html',
            targetElement: `${heading.tagName.toLowerCase()}:nth-child(${index + 1})`,
            htmlSnippet: heading.outerHTML.substring(0, 200)
          })
        }
        previousLevel = currentLevel
      })
      
      // Enhanced: Check for keyboard focusable elements
      const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]')
      focusableElements.forEach((element, index) => {
        const tabIndex = element.getAttribute('tabindex')
        if (tabIndex && parseInt(tabIndex) > 0) {
          results.push({
            ruleId: 'tabindex',
            impact: 'minor',
            description: 'Avoid positive tabindex values',
            helpText: 'Use tabindex="0" or remove tabindex to maintain natural tab order',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html',
            targetElement: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
            htmlSnippet: element.outerHTML.substring(0, 200)
          })
        }
      })
      
      return results
    })
    
    issues.push(...checkResults)
    
  } catch (error) {
    console.error('Error performing accessibility checks:', error)
  }
  
  return issues
}
