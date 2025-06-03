
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyzeRequest {
  issueId: string;
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

    const { issueId }: AnalyzeRequest = await req.json()
    
    console.log(`Analyzing issue ${issueId} with Gemini AI`)

    // Get issue details
    const { data: issue, error: issueError } = await supabaseClient
      .from('accessibility_issues')
      .select('*')
      .eq('id', issueId)
      .single()

    if (issueError || !issue) {
      throw new Error(`Issue not found: ${issueError?.message}`)
    }

    // Prepare prompt for Gemini
    const prompt = `
Du bist ein Accessibility-Experte. Analysiere das folgende Accessibility-Problem und gib mir:

1. Eine detaillierte Erklärung des Problems auf Deutsch
2. Konkrete Lösungsvorschläge mit Code-Beispielen
3. WCAG-Richtlinien, die betroffen sind

Problem Details:
- Rule ID: ${issue.rule_id}
- Impact: ${issue.impact}
- Beschreibung: ${issue.description}
- HTML Element: ${issue.target_element || 'Nicht verfügbar'}
- HTML Code: ${issue.html_snippet || 'Nicht verfügbar'}

Gib deine Antwort als JSON zurück mit den Feldern:
{
  "explanation": "Detaillierte Erklärung auf Deutsch",
  "fixSuggestion": "Konkrete Lösungsvorschläge mit Code-Beispielen",
  "wcagGuidelines": "Betroffene WCAG-Richtlinien"
}
`

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
            temperature: 0.3,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`)
    }

    const geminiData: GeminiResponse = await geminiResponse.json()
    const aiText = geminiData.candidates[0]?.content?.parts[0]?.text

    if (!aiText) {
      throw new Error('No response from Gemini API')
    }

    // Parse JSON response from AI
    let aiAnalysis
    try {
      // Extract JSON from response (in case AI adds markdown formatting)
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? jsonMatch[0] : aiText
      aiAnalysis = JSON.parse(jsonText)
    } catch (e) {
      // Fallback if JSON parsing fails
      aiAnalysis = {
        explanation: aiText.substring(0, 500),
        fixSuggestion: "Bitte konsultieren Sie die WCAG-Richtlinien für spezifische Lösungen.",
        wcagGuidelines: "Siehe Help URL für Details"
      }
    }

    // Update issue with AI analysis
    await supabaseClient
      .from('accessibility_issues')
      .update({
        ai_explanation: aiAnalysis.explanation,
        ai_fix_suggestion: aiAnalysis.fixSuggestion
      })
      .eq('id', issueId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: aiAnalysis 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('AI analysis error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
