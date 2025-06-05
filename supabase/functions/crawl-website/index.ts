
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
  wcagLevel?: 'A' | 'AA' | 'AAA';
  wcagPrinciple?: 'perceivable' | 'operable' | 'understandable' | 'robust';
  wcagGuideline?: string;
}

// WCAG 2.2 Rule Definitions with German translations
const WCAG_RULES = {
  'image-alt': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'perceivable' as const,
    wcagGuideline: '1.1.1',
    description: 'Bilder müssen alternative Texte haben',
    helpText: 'Fügen Sie aussagekräftige Alt-Texte hinzu, die den Bildinhalt beschreiben',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html'
  },
  'label': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'perceivable' as const,
    wcagGuideline: '1.3.1',
    description: 'Formularelemente müssen Labels haben',
    helpText: 'Fügen Sie ein Label-Element oder aria-label Attribut hinzu',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html'
  },
  'document-title': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'operable' as const,
    wcagGuideline: '2.4.2',
    description: 'Seite muss einen aussagekräftigen Titel haben',
    helpText: 'Fügen Sie ein beschreibendes Title-Element zur Seite hinzu',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html'
  },
  'html-has-lang': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'perceivable' as const,
    wcagGuideline: '3.1.1',
    description: 'HTML-Element muss ein lang-Attribut haben',
    helpText: 'Fügen Sie das lang-Attribut zum HTML-Element hinzu',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html'
  },
  'page-has-heading-one': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'perceivable' as const,
    wcagGuideline: '1.3.1',
    description: 'Seite sollte eine Hauptüberschrift (h1) enthalten',
    helpText: 'Fügen Sie ein h1-Element hinzu, um die Seitenstruktur zu verbessern',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html'
  },
  'heading-order': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'perceivable' as const,
    wcagGuideline: '1.3.1',
    description: 'Überschriften sollten keine Ebenen überspringen',
    helpText: 'Verwenden Sie Überschriften in sequenzieller Reihenfolge (h1, h2, h3, etc.)',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html'
  },
  'skip-link': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'operable' as const,
    wcagGuideline: '2.4.1',
    description: 'Seite sollte Skip-Navigation-Links haben',
    helpText: 'Fügen Sie einen Skip-Link zum Hauptinhalt für Tastaturnutzer hinzu',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html'
  },
  'button-name': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'robust' as const,
    wcagGuideline: '4.1.2',
    description: 'Buttons müssen zugängliche Namen haben',
    helpText: 'Fügen Sie Textinhalt oder aria-label zum Button hinzu',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html'
  },
  'link-name': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'robust' as const,
    wcagGuideline: '4.1.2',
    description: 'Links müssen zugängliche Namen haben',
    helpText: 'Fügen Sie Textinhalt oder aria-label zum Link hinzu',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html'
  },
  'color-contrast': {
    wcagLevel: 'AA' as const,
    wcagPrinciple: 'perceivable' as const,
    wcagGuideline: '1.4.3',
    description: 'Ausreichender Farbkontrast erforderlich',
    helpText: 'Stellen Sie sicher, dass Text ausreichenden Kontrast zum Hintergrund hat (4.5:1 für normalen Text)',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'
  },
  'focus-order': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'operable' as const,
    wcagGuideline: '2.4.3',
    description: 'Fokus-Reihenfolge muss logisch sein',
    helpText: 'Stellen Sie sicher, dass Elemente in einer sinnvollen Reihenfolge fokussiert werden',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html'
  },
  'landmark-one-main': {
    wcagLevel: 'AA' as const,
    wcagPrinciple: 'perceivable' as const,
    wcagGuideline: '1.3.6',
    description: 'Seite sollte ein main-Landmark haben',
    helpText: 'Fügen Sie ein <main> Element oder role="main" hinzu',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html'
  },
  'region': {
    wcagLevel: 'AA' as const,
    wcagPrinciple: 'perceivable' as const,
    wcagGuideline: '1.3.6',
    description: 'Seiteninhalt sollte in Landmarks organisiert sein',
    helpText: 'Verwenden Sie semantische HTML-Elemente wie <header>, <nav>, <main>, <footer>',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html'
  },
  'meta-viewport': {
    wcagLevel: 'AA' as const,
    wcagPrinciple: 'perceivable' as const,
    wcagGuideline: '1.4.10',
    description: 'Viewport-Meta-Tag sollte Zooming nicht verhindern',
    helpText: 'Entfernen Sie user-scalable=no oder maximum-scale<5 aus dem Viewport-Meta-Tag',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/reflow.html'
  },
  'duplicate-id': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'robust' as const,
    wcagGuideline: '4.1.1',
    description: 'ID-Attribute müssen eindeutig sein',
    helpText: 'Stellen Sie sicher, dass jede ID nur einmal pro Seite verwendet wird',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/parsing.html'
  },
  'tabindex': {
    wcagLevel: 'A' as const,
    wcagPrinciple: 'operable' as const,
    wcagGuideline: '2.1.1',
    description: 'Vermeiden Sie positive tabindex-Werte',
    helpText: 'Verwenden Sie tabindex="0" oder "-1" anstelle positiver Werte',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html'
  }
};

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
    
    console.log(`Starting enhanced WCAG 2.2 crawl for website ${websiteId}, scan ${scanId}`)

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
      JSON.stringify({ success: true, message: 'Enhanced WCAG 2.2 crawl started in background' }),
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
    console.log('Starting enhanced background crawl process...')
    
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
    
    console.log(`Discovered ${urlsToCrawl.length} URLs to crawl with enhanced checks`)

    // Update total pages count
    await supabaseClient
      .from('scans')
      .update({ total_pages: urlsToCrawl.length })
      .eq('id', scanId)

    let totalIssues = 0
    let scannedCount = 0

    // Crawl each URL with enhanced accessibility checks
    for (const url of urlsToCrawl) {
      try {
        console.log(`Enhanced crawling: ${url}`)
        
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

        // Save accessibility issues with enhanced WCAG 2.2 data
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

    console.log(`Enhanced crawl completed. Scanned ${scannedCount} pages, found ${totalIssues} WCAG 2.2 issues`)

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
          'User-Agent': 'Mozilla/5.0 (compatible; WCAG-AccessibilityBot/2.2)'
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
      
      // Extract all links using DOM parsing
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
                !pathname.endsWith('.gif') &&
                !pathname.endsWith('.zip') &&
                !pathname.endsWith('.doc') &&
                !pathname.endsWith('.docx')) {
              
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
        'User-Agent': 'Mozilla/5.0 (compatible; WCAG-AccessibilityBot/2.2)'
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
    
    // Perform comprehensive WCAG 2.2 accessibility checks
    const issues = await performComprehensiveAccessibilityChecks(doc, url)
    
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

async function performComprehensiveAccessibilityChecks(doc: any, url: string): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = []
  
  try {
    // 1. Images - Alt text validation (WCAG 1.1.1 Level A)
    const images = doc.querySelectorAll('img')
    for (const img of images) {
      const alt = img.getAttribute('alt')
      const src = img.getAttribute('src')
      
      if (!img.hasAttribute('alt')) {
        issues.push(createIssue('image-alt', 'serious', img, 'Bild ohne Alt-Attribut'))
      } else if (alt?.trim() === '' && !img.hasAttribute('role') && img.getAttribute('role') !== 'presentation') {
        // Empty alt should only be for decorative images
        issues.push(createIssue('image-alt', 'moderate', img, 'Leeres Alt-Attribut für potenziell wichtiges Bild'))
      } else if (alt && (alt.toLowerCase().includes('image') || alt.toLowerCase().includes('photo') || alt.toLowerCase().includes('picture'))) {
        issues.push(createIssue('image-alt', 'minor', img, 'Alt-Text enthält redundante Wörter wie "Bild" oder "Foto"'))
      }
    }
    
    // 2. Form elements - Labels validation (WCAG 1.3.1 Level A)
    const formInputs = doc.querySelectorAll('input[type]:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea')
    for (const input of formInputs) {
      const hasLabel = input.hasAttribute('aria-label') || 
                      input.hasAttribute('aria-labelledby') ||
                      input.hasAttribute('title') ||
                      (input.getAttribute('id') && doc.querySelector(`label[for="${input.getAttribute('id')}"]`))
      
      if (!hasLabel) {
        issues.push(createIssue('label', 'critical', input, 'Formularelement ohne Label oder aria-label'))
      }
    }
    
    // 3. Page title validation (WCAG 2.4.2 Level A)
    const titleElement = doc.querySelector('title')
    if (!titleElement || !titleElement.textContent?.trim()) {
      issues.push(createIssue('document-title', 'serious', titleElement || doc.querySelector('head'), 'Seite hat keinen Titel'))
    } else if (titleElement.textContent.trim().length < 10) {
      issues.push(createIssue('document-title', 'moderate', titleElement, 'Seitentitel ist zu kurz und wenig aussagekräftig'))
    }
    
    // 4. Language attribute validation (WCAG 3.1.1 Level A)
    const htmlElement = doc.querySelector('html')
    if (!htmlElement?.hasAttribute('lang') || htmlElement.getAttribute('lang')?.trim() === '') {
      issues.push(createIssue('html-has-lang', 'serious', htmlElement, 'HTML-Element hat kein lang-Attribut'))
    }
    
    // 5. Heading structure validation (WCAG 1.3.1 Level A)
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const h1Elements = doc.querySelectorAll('h1')
    
    if (h1Elements.length === 0) {
      issues.push(createIssue('page-has-heading-one', 'moderate', doc.querySelector('body'), 'Seite hat keine Hauptüberschrift (h1)'))
    } else if (h1Elements.length > 1) {
      issues.push(createIssue('page-has-heading-one', 'minor', h1Elements[1], 'Mehrere h1-Elemente gefunden - sollte nur eines geben'))
    }
    
    // Check heading hierarchy
    let previousLevel = 0
    for (const heading of headings) {
      const currentLevel = parseInt(heading.tagName.charAt(1))
      if (previousLevel > 0 && currentLevel > previousLevel + 1) {
        issues.push(createIssue('heading-order', 'moderate', heading, `Überschrift ${heading.tagName} überspringt Ebenen`))
      }
      previousLevel = currentLevel
    }
    
    // 6. Skip links validation (WCAG 2.4.1 Level A)
    const skipLinks = doc.querySelectorAll('a[href^="#"]')
    const hasSkipToMain = Array.from(skipLinks).some(link => {
      const text = link.textContent?.toLowerCase() || ''
      return text.includes('skip') || text.includes('springe') || text.includes('zum inhalt')
    })
    
    if (!hasSkipToMain && headings.length > 3) {
      issues.push(createIssue('skip-link', 'moderate', doc.querySelector('body'), 'Keine Skip-Links gefunden'))
    }
    
    // 7. Button accessibility validation (WCAG 4.1.2 Level A)
    const buttons = doc.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="reset"]')
    for (const button of buttons) {
      const hasAccessibleName = button.textContent?.trim() || 
                               button.hasAttribute('aria-label') || 
                               button.hasAttribute('aria-labelledby') ||
                               button.getAttribute('value')
      
      if (!hasAccessibleName) {
        issues.push(createIssue('button-name', 'serious', button, 'Button ohne zugänglichen Namen'))
      }
    }
    
    // 8. Link accessibility validation (WCAG 4.1.2 Level A)
    const links = doc.querySelectorAll('a[href]')
    for (const link of links) {
      const hasAccessibleName = link.textContent?.trim() || 
                               link.hasAttribute('aria-label') || 
                               link.hasAttribute('aria-labelledby')
      
      if (!hasAccessibleName) {
        issues.push(createIssue('link-name', 'serious', link, 'Link ohne zugänglichen Namen'))
      } else if (link.textContent?.trim().toLowerCase() === 'hier' || 
                 link.textContent?.trim().toLowerCase() === 'mehr' ||
                 link.textContent?.trim().toLowerCase() === 'click here') {
        issues.push(createIssue('link-name', 'minor', link, 'Link-Text ist nicht aussagekräftig'))
      }
    }
    
    // 9. Landmarks validation (WCAG 1.3.6 Level AA)
    const mainElements = doc.querySelectorAll('main, [role="main"]')
    if (mainElements.length === 0) {
      issues.push(createIssue('landmark-one-main', 'moderate', doc.querySelector('body'), 'Keine main-Landmark gefunden'))
    } else if (mainElements.length > 1) {
      issues.push(createIssue('landmark-one-main', 'minor', mainElements[1], 'Mehrere main-Landmarks gefunden'))
    }
    
    // Check for basic landmark structure
    const hasHeader = doc.querySelector('header, [role="banner"]')
    const hasNav = doc.querySelector('nav, [role="navigation"]')
    const hasFooter = doc.querySelector('footer, [role="contentinfo"]')
    
    if (!hasHeader && !hasNav && !hasFooter) {
      issues.push(createIssue('region', 'minor', doc.querySelector('body'), 'Keine semantische Seitenstruktur (header, nav, footer) gefunden'))
    }
    
    // 10. Viewport meta tag validation (WCAG 1.4.10 Level AA)
    const viewportMeta = doc.querySelector('meta[name="viewport"]')
    if (viewportMeta) {
      const content = viewportMeta.getAttribute('content') || ''
      if (content.includes('user-scalable=no') || 
          (content.includes('maximum-scale=') && parseFloat(content.split('maximum-scale=')[1]) < 5)) {
        issues.push(createIssue('meta-viewport', 'serious', viewportMeta, 'Viewport verhindert Zooming'))
      }
    }
    
    // 11. Duplicate ID validation (WCAG 4.1.1 Level A)
    const elementsWithId = doc.querySelectorAll('[id]')
    const seenIds = new Set()
    for (const element of elementsWithId) {
      const id = element.getAttribute('id')
      if (id && seenIds.has(id)) {
        issues.push(createIssue('duplicate-id', 'minor', element, `Doppelte ID gefunden: ${id}`))
      } else if (id) {
        seenIds.add(id)
      }
    }
    
    // 12. Tabindex validation (WCAG 2.1.1 Level A)
    const elementsWithTabindex = doc.querySelectorAll('[tabindex]')
    for (const element of elementsWithTabindex) {
      const tabindex = parseInt(element.getAttribute('tabindex') || '0')
      if (tabindex > 0) {
        issues.push(createIssue('tabindex', 'moderate', element, `Positiver tabindex-Wert (${tabindex}) gefunden`))
      }
    }
    
    // 13. Color contrast basic check (WCAG 1.4.3 Level AA)
    const elementsWithInlineStyle = doc.querySelectorAll('*[style]')
    for (const element of elementsWithInlineStyle) {
      const style = element.getAttribute('style') || ''
      if (style.includes('color:') && style.includes('background')) {
        issues.push(createIssue('color-contrast', 'minor', element, 'Inline-Styles mit Farben gefunden - Kontrast prüfen'))
      }
    }
    
    // 14. Focus order validation (WCAG 2.4.3 Level A)
    const focusableElements = doc.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])')
    if (focusableElements.length > 0) {
      // Basic check for logical focus order (this is simplified)
      const firstFocusable = focusableElements[0]
      const rect = firstFocusable?.getBoundingClientRect?.()
      if (!rect || (rect.top > 200 && focusableElements.length > 5)) {
        issues.push(createIssue('focus-order', 'minor', firstFocusable, 'Erstes fokussierbares Element könnte nicht optimal positioniert sein'))
      }
    }
    
  } catch (error) {
    console.error('Error performing comprehensive accessibility checks:', error)
  }
  
  return issues
}

function createIssue(
  ruleId: string, 
  impact: 'critical' | 'serious' | 'moderate' | 'minor', 
  element: any, 
  context?: string
): AccessibilityIssue {
  const rule = WCAG_RULES[ruleId as keyof typeof WCAG_RULES]
  
  return {
    ruleId,
    impact,
    description: rule?.description || `Accessibility issue: ${ruleId}`,
    helpText: rule?.helpText,
    helpUrl: rule?.helpUrl,
    targetElement: element?.tagName?.toLowerCase() || 'unknown',
    htmlSnippet: element?.outerHTML?.substring(0, 200) || '',
    wcagLevel: rule?.wcagLevel,
    wcagPrinciple: rule?.wcagPrinciple,
    wcagGuideline: rule?.wcagGuideline
  }
}
