
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
    
    console.log(`Generating WCAG 2.2 report for scan ${scanId} with Gemini AI`)

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

    // Generate expert prompt based on report type
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
  
  const baseContext = `
Website: ${scan.website.name} (${scan.website.base_url})
Scan durchgeführt: ${new Date(scan.started_at).toLocaleDateString('de-DE')}
Geprüfte Seiten: ${stats.totalPages}
Gefundene Issues: ${stats.totalIssues}

Issue-Verteilung:
- Kritisch: ${stats.criticalIssues}
- Schwerwiegend: ${stats.seriousIssues}  
- Mäßig: ${stats.moderateIssues}
- Gering: ${stats.minorIssues}

WCAG 2.2 Level-Verteilung:
- Level A: ${stats.wcagLevelA} Issues
- Level AA: ${stats.wcagLevelAA} Issues  
- Level AAA: ${stats.wcagLevelAAA} Issues

WCAG-Prinzipien-Verteilung:
- Wahrnehmbar: ${stats.principleBreakdown.wahrnehmbar} Issues
- Bedienbar: ${stats.principleBreakdown.bedienbar} Issues
- Verständlich: ${stats.principleBreakdown.verständlich} Issues
- Robust: ${stats.principleBreakdown.robust} Issues

Detaillierte Issues:
${issues.slice(0, 20).map(issue => `
- ${issue.rule_id} (${issue.impact}): ${issue.description}
  WCAG: ${issue.wcag_level} | Prinzip: ${issue.wcag_principle}
  ${issue.ai_explanation ? `Erklärung: ${issue.ai_explanation.substring(0, 200)}...` : ''}
`).join('\n')}
`

  if (reportType === 'executive') {
    return `
Du bist ein führender Web-Accessibility-Experte und Chief Technology Officer. Erstelle einen Executive Summary Report für die Geschäftsführung über die WCAG 2.2 Compliance-Analyse.

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

Schreibe wie ein C-Level Executive für C-Level Executives. Fokus auf Business Impact, nicht auf technische Details.
`
  }

  if (reportType === 'summary') {
    return `
Du bist ein Web-Accessibility-Experte und erstellst einen übersichtlichen Summary Report für Projektmanager und Entwicklungsteams.

${baseContext}

Erstelle einen strukturierten Summary Report mit:

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

Schreibe prägnant und handlungsorientiert für ein technisches Publikum.
`
  }

  // Detailed report (default)
  return `
Du bist ein führender Web-Accessibility-Experte und WCAG 2.2 Spezialist. Erstelle einen umfassenden, expertenhaften Accessibility-Audit-Report.

${baseContext}

Erstelle einen detaillierten Experten-Report mit folgender Struktur:

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

Schreibe wie ein Accessibility-Experte mit 15+ Jahren Erfahrung. Verwende Fachterminologie korrekt, sei präzise und handlungsorientiert. Jede Empfehlung soll konkret und umsetzbar sein.

Der Report soll sowohl für technische Teams als auch für Management verständlich sein. Verwende deutsche Fachbegriffe korrekt und ergänze englische Begriffe in Klammern wo sinnvoll.

Wichtig: Strukturiere den Report so, dass er als professionelles Dokument für Kunden oder interne Stakeholder verwendet werden kann.
`
}
