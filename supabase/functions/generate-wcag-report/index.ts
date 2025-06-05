
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateReportRequest {
  scanId: string;
  reportType: 'summary' | 'detailed' | 'executive';
  language: 'de' | 'en';
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { scanId, reportType = 'detailed', language = 'de' }: GenerateReportRequest = await req.json()
    
    console.log(`Generating WCAG 2.2 report for scan ${scanId} in ${language} language with Gemini AI`)

    // Get comprehensive scan data
    const { data: scan, error: scanError } = await supabaseClient
      .from('scans')
      .select(`
        *,
        website:websites(name, base_url)
      `)
      .eq('id', scanId)
      .single()

    if (scanError || !scan) {
      throw new Error(`Scan not found: ${scanError?.message}`)
    }

    // Get scan results
    const { data: scanResults, error: resultsError } = await supabaseClient
      .from('scan_results')
      .select('*')
      .eq('scan_id', scanId)

    if (resultsError) {
      throw new Error(`Failed to fetch scan results: ${resultsError.message}`)
    }

    // Get accessibility issues with full details
    const { data: issues, error: issuesError } = await supabaseClient
      .from('accessibility_issues')
      .select('*')
      .in('scan_result_id', (scanResults || []).map(r => r.id))

    if (issuesError) {
      throw new Error(`Failed to fetch issues: ${issuesError.message}`)
    }

    // Prepare comprehensive data for report generation
    const reportData = {
      scan,
      scanResults: scanResults || [],
      issues: issues || [],
      stats: {
        totalPages: scan.scanned_pages,
        totalIssues: scan.total_issues,
        criticalIssues: (issues || []).filter(i => i.impact === 'critical').length,
        seriousIssues: (issues || []).filter(i => i.impact === 'serious').length,
        moderateIssues: (issues || []).filter(i => i.impact === 'moderate').length,
        minorIssues: (issues || []).filter(i => i.impact === 'minor').length,
        wcagLevelA: (issues || []).filter(i => i.wcag_level === 'A').length,
        wcagLevelAA: (issues || []).filter(i => i.wcag_level === 'AA').length,
        wcagLevelAAA: (issues || []).filter(i => i.wcag_level === 'AAA').length,
        principleBreakdown: {
          wahrnehmbar: (issues || []).filter(i => i.wcag_principle === 'Wahrnehmbar').length,
          bedienbar: (issues || []).filter(i => i.wcag_principle === 'Bedienbar').length,
          verständlich: (issues || []).filter(i => i.wcag_principle === 'Verständlich').length,
          robust: (issues || []).filter(i => i.wcag_principle === 'Robust').length,
        }
      }
    }

    // Generate expert prompt based on report type and language
    const prompt = generateExpertPrompt(reportData, reportType, language)

    // Call Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API Key not configured')
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`)
    }

    const geminiData: GeminiResponse = await geminiResponse.json()
    const reportContent = geminiData.candidates[0]?.content?.parts[0]?.text

    if (!reportContent) {
      throw new Error('No response from Gemini API')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        report: reportContent,
        metadata: {
          generatedAt: new Date().toISOString(),
          reportType,
          language,
          scanId,
          websiteName: scan.website.name
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Report generation error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

function generateExpertPrompt(reportData: any, reportType: string, language: string): string {
  const { scan, scanResults, issues, stats } = reportData
  
  // Language-specific content
  const content = language === 'de' ? {
    websiteLabel: 'Website',
    scanPerformedLabel: 'Scan durchgeführt',
    pagesTestedLabel: 'Geprüfte Seiten',
    issuesFoundLabel: 'Gefundene Issues',
    issueDistributionLabel: 'Issue-Verteilung',
    critical: 'Kritisch',
    serious: 'Schwerwiegend',
    moderate: 'Mäßig',
    minor: 'Gering',
    wcagLevelDistributionLabel: 'WCAG 2.2 Level-Verteilung',
    wcagPrinciplesDistributionLabel: 'WCAG-Prinzipien-Verteilung',
    perceivable: 'Wahrnehmbar',
    operable: 'Bedienbar',
    understandable: 'Verständlich',
    robust: 'Robust',
    detailedIssuesLabel: 'Detaillierte Issues',
    explanation: 'Erklärung',
    principle: 'Prinzip'
  } : {
    websiteLabel: 'Website',
    scanPerformedLabel: 'Scan performed',
    pagesTestedLabel: 'Pages tested',
    issuesFoundLabel: 'Issues found',
    issueDistributionLabel: 'Issue distribution',
    critical: 'Critical',
    serious: 'Serious',
    moderate: 'Moderate',
    minor: 'Minor',
    wcagLevelDistributionLabel: 'WCAG 2.2 Level distribution',
    wcagPrinciplesDistributionLabel: 'WCAG principles distribution',
    perceivable: 'Perceivable',
    operable: 'Operable',
    understandable: 'Understandable',
    robust: 'Robust',
    detailedIssuesLabel: 'Detailed Issues',
    explanation: 'Explanation',
    principle: 'Principle'
  }
  
  const baseContext = `
${content.websiteLabel}: ${scan.website.name} (${scan.website.base_url})
${content.scanPerformedLabel}: ${new Date(scan.started_at).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
${content.pagesTestedLabel}: ${stats.totalPages}
${content.issuesFoundLabel}: ${stats.totalIssues}

${content.issueDistributionLabel}:
- ${content.critical}: ${stats.criticalIssues}
- ${content.serious}: ${stats.seriousIssues}  
- ${content.moderate}: ${stats.moderateIssues}
- ${content.minor}: ${stats.minorIssues}

${content.wcagLevelDistributionLabel}:
- Level A: ${stats.wcagLevelA} Issues
- Level AA: ${stats.wcagLevelAA} Issues  
- Level AAA: ${stats.wcagLevelAAA} Issues

${content.wcagPrinciplesDistributionLabel}:
- ${content.perceivable}: ${stats.principleBreakdown.wahrnehmbar} Issues
- ${content.operable}: ${stats.principleBreakdown.bedienbar} Issues
- ${content.understandable}: ${stats.principleBreakdown.verständlich} Issues
- ${content.robust}: ${stats.principleBreakdown.robust} Issues

${content.detailedIssuesLabel}:
${issues.slice(0, 20).map(issue => `
- ${issue.rule_id} (${issue.impact}): ${issue.description}
  WCAG: ${issue.wcag_level} | ${content.principle}: ${issue.wcag_principle}
  ${issue.ai_explanation ? `${content.explanation}: ${issue.ai_explanation.substring(0, 200)}...` : ''}
`).join('\n')}
`

  if (language === 'de') {
    if (reportType === 'executive') {
      return `
Du bist ein führender Web-Accessibility-Experte und Chief Technology Officer. Erstelle einen Executive Summary Report für die Geschäftsführung über die WCAG 2.2 Compliance-Analyse.

WICHTIG: Antworte ausschließlich auf Deutsch!

${baseContext}

Erstelle einen professionellen Executive Summary (2-3 Seiten) mit:

1. **EXECUTIVE SUMMARY**
   - Geschäftskritische Zusammenfassung der Accessibility-Situation
   - Risikobewertung und rechtliche Implikationen
   - ROI der Accessibility-Verbesserungen

2. **COMPLIANCE-STATUS**
   - WCAG 2.2 Compliance-Level (A, AA, AAA)
   - Abweichungen von gesetzlichen Anforderungen
   - Benchmarking gegen Industriestandards

3. **BUSINESS IMPACT**
   - Potenzielle Nutzergruppen, die betroffen sind
   - Geschäftsrisiken durch Non-Compliance
   - Marktchancen durch bessere Accessibility

4. **STRATEGISCHE EMPFEHLUNGEN**
   - Priorisierte Handlungsfelder
   - Ressourcenbedarf und Timeline
   - Quick Wins vs. langfristige Maßnahmen

5. **INVESTITIONSEMPFEHLUNG**
   - Geschätzte Kosten für Compliance
   - Erwarteter Business Value
   - Nächste Schritte

Schreibe wie ein C-Level Executive für C-Level Executives auf Deutsch. Fokus auf Business Impact, nicht auf technische Details.
`
    }

    if (reportType === 'summary') {
      return `
Du bist ein Web-Accessibility-Experte und erstellst einen übersichtlichen Summary Report für Projektmanager und Entwicklungsteams.

WICHTIG: Antworte ausschließlich auf Deutsch!

${baseContext}

Erstelle einen strukturierten Summary Report auf Deutsch mit:

1. **ÜBERBLICK**
   - Website-Bewertung auf einen Blick
   - Compliance-Score und Level
   - Hauptproblembereiche

2. **PRIORITÄTEN**
   - Top 5 kritische Issues, die sofort behoben werden müssen
   - Quick Wins mit geringem Aufwand
   - Mittelfristige Verbesserungen

3. **WCAG 2.2 COMPLIANCE**
   - Status für Level A, AA, AAA
   - Erfüllungsgrad pro Prinzip
   - Rechtliche Mindestanforderungen

4. **HANDLUNGSEMPFEHLUNGEN**
   - Sofortmaßnahmen (1-2 Wochen)
   - Kurzfristige Maßnahmen (1-3 Monate)
   - Langfristige Strategie (3-12 Monate)

Schreibe prägnant und handlungsorientiert für ein technisches Publikum auf Deutsch.
`
    }

    // Detailed report (default)
    return `
Du bist ein führender Web-Accessibility-Experte und WCAG 2.2 Spezialist. Erstelle einen umfassenden, expertenhaften Accessibility-Audit-Report.

WICHTIG: Antworte ausschließlich auf Deutsch!

${baseContext}

Erstelle einen detaillierten Experten-Report auf Deutsch mit folgender Struktur:

1. **EXECUTIVE SUMMARY**
   - Gesamtbewertung der Website-Accessibility
   - Compliance-Status nach WCAG 2.2 (A, AA, AAA)
   - Haupterkenntnisse und kritische Handlungsfelder

2. **METHODOLOGIE & SCOPE**
   - Prüfumfang und verwendete Standards
   - Automatisierte vs. manuelle Prüfung
   - Limitations und Empfehlungen für weitere Tests

3. **WCAG 2.2 COMPLIANCE-ANALYSE**
   - Detaillierte Bewertung nach den 4 Prinzipien:
     * Wahrnehmbar (Perceivable)
     * Bedienbar (Operable) 
     * Verständlich (Understandable)
     * Robust (Robust)
   - Level A/AA/AAA Erfüllungsgrad
   - Kritische Compliance-Lücken

4. **ISSUE-KATEGORISIERUNG & PRIORISIERUNG**
   - Kritische Issues (Blocker für Accessibility)
   - Schwerwiegende Issues (Major Impact)
   - Moderate Issues (Usability Impact)
   - Minor Issues (Enhancement Opportunities)

5. **DETAILLIERTE FINDINGS**
   - Top 10 kritische Issues mit:
     * WCAG 2.2 Kriterium-Referenz
     * User Impact Assessment
     * Technische Beschreibung
     * Lösungsansätze mit Code-Beispielen
     * Aufwandsschätzung

6. **NUTZERGRUPPEN-IMPACT**
   - Betroffene Behinderungsarten
   - Assistive Technologies Impact
   - Usability für verschiedene Nutzergruppen

7. **RECHTLICHE & COMPLIANCE-ASPEKTE**
   - BITV 2.0 / EN 301 549 Konformität
   - ADA/Section 508 Compliance (falls relevant)
   - Risikobewertung für rechtliche Konsequenzen

8. **HANDLUNGSPLAN & ROADMAP**
   - Priorisierte Umsetzungsreihenfolge
   - Quick Wins (1-4 Wochen)
   - Short-term (1-3 Monate)
   - Medium-term (3-6 Monate)
   - Long-term (6-12 Monate)

9. **BEST PRACTICES & EMPFEHLUNGEN**
   - Design System Empfehlungen
   - Development Guidelines
   - Testing Strategy
   - Maintenance & Monitoring

10. **ANHANG**
    - Vollständige Issue-Liste
    - WCAG 2.2 Checkliste
    - Nützliche Tools und Ressourcen

Schreibe wie ein Accessibility-Experte mit 15+ Jahren Erfahrung auf Deutsch. Verwende deutsche Fachterminologie korrekt, sei präzise und handlungsorientiert. Jede Empfehlung soll konkret und umsetzbar sein.

Der Report soll sowohl für technische Teams als auch für Management verständlich sein. Verwende deutsche Fachbegriffe korrekt und ergänze englische Begriffe in Klammern wo sinnvoll.

Wichtig: Strukturiere den Report so, dass er als professionelles Dokument für Kunden oder interne Stakeholder verwendet werden kann.
`
  } else {
    // English prompts (existing logic)
    if (reportType === 'executive') {
      return `
You are a leading Web Accessibility expert and Chief Technology Officer. Create an Executive Summary Report for management about the WCAG 2.2 compliance analysis.

IMPORTANT: Respond exclusively in English!

${baseContext}

Create a professional Executive Summary (2-3 pages) with:

1. **EXECUTIVE SUMMARY**
   - Business-critical summary of accessibility situation
   - Risk assessment and legal implications
   - ROI of accessibility improvements

2. **COMPLIANCE STATUS**
   - WCAG 2.2 compliance levels (A, AA, AAA)
   - Deviations from legal requirements
   - Benchmarking against industry standards

3. **BUSINESS IMPACT**
   - Potential user groups affected
   - Business risks from non-compliance
   - Market opportunities through better accessibility

4. **STRATEGIC RECOMMENDATIONS**
   - Prioritized action areas
   - Resource requirements and timeline
   - Quick wins vs. long-term measures

5. **INVESTMENT RECOMMENDATION**
   - Estimated costs for compliance
   - Expected business value
   - Next steps

Write like a C-Level executive for C-Level executives in English. Focus on business impact, not technical details.
`
    }

    if (reportType === 'summary') {
      return `
You are a Web Accessibility expert creating a clear Summary Report for project managers and development teams.

IMPORTANT: Respond exclusively in English!

${baseContext}

Create a structured Summary Report in English with:

1. **OVERVIEW**
   - Website assessment at a glance
   - Compliance score and level
   - Main problem areas

2. **PRIORITIES**
   - Top 5 critical issues that need immediate fixing
   - Quick wins with low effort
   - Medium-term improvements

3. **WCAG 2.2 COMPLIANCE**
   - Status for Level A, AA, AAA
   - Fulfillment rate per principle
   - Legal minimum requirements

4. **ACTION RECOMMENDATIONS**
   - Immediate measures (1-2 weeks)
   - Short-term measures (1-3 months)
   - Long-term strategy (3-12 months)

Write concisely and action-oriented for a technical audience in English.
`
    }

    // Detailed report (default)
    return `
You are a leading Web Accessibility expert and WCAG 2.2 specialist. Create a comprehensive, expert accessibility audit report.

IMPORTANT: Respond exclusively in English!

${baseContext}

Create a detailed expert report in English with the following structure:

1. **EXECUTIVE SUMMARY**
   - Overall assessment of website accessibility
   - WCAG 2.2 compliance status (A, AA, AAA)
   - Key findings and critical action areas

2. **METHODOLOGY & SCOPE**
   - Testing scope and standards used
   - Automated vs. manual testing
   - Limitations and recommendations for further testing

3. **WCAG 2.2 COMPLIANCE ANALYSIS**
   - Detailed assessment by the 4 principles:
     * Perceivable
     * Operable
     * Understandable
     * Robust
   - Level A/AA/AAA fulfillment rate
   - Critical compliance gaps

4. **ISSUE CATEGORIZATION & PRIORITIZATION**
   - Critical Issues (Accessibility blockers)
   - Serious Issues (Major impact)
   - Moderate Issues (Usability impact)
   - Minor Issues (Enhancement opportunities)

5. **DETAILED FINDINGS**
   - Top 10 critical issues with:
     * WCAG 2.2 criterion reference
     * User impact assessment
     * Technical description
     * Solution approaches with code examples
     * Effort estimation

6. **USER GROUP IMPACT**
   - Affected disability types
   - Assistive technology impact
   - Usability for different user groups

7. **LEGAL & COMPLIANCE ASPECTS**
   - BITV 2.0 / EN 301 549 conformity
   - ADA/Section 508 compliance (if relevant)
   - Risk assessment for legal consequences

8. **ACTION PLAN & ROADMAP**
   - Prioritized implementation order
   - Quick wins (1-4 weeks)
   - Short-term (1-3 months)
   - Medium-term (3-6 months)
   - Long-term (6-12 months)

9. **BEST PRACTICES & RECOMMENDATIONS**
   - Design system recommendations
   - Development guidelines
   - Testing strategy
   - Maintenance & monitoring

10. **APPENDIX**
    - Complete issue list
    - WCAG 2.2 checklist
    - Useful tools and resources

Write like an accessibility expert with 15+ years of experience in English. Use correct technical terminology, be precise and action-oriented. Every recommendation should be concrete and implementable.

The report should be understandable for both technical teams and management. Use correct English technical terms and add German terms in brackets where sensible.

Important: Structure the report so it can be used as a professional document for clients or internal stakeholders.
`
  }
}
