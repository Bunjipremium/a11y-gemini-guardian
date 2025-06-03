
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  ExternalLink,
  Code,
  Info,
  Lightbulb
} from 'lucide-react';

interface AccessibilityIssue {
  id: string;
  rule_id: string;
  impact: string;
  description: string;
  help_text: string | null;
  help_url: string | null;
  target_element: string | null;
  html_snippet: string | null;
  ai_explanation: string | null;
  ai_fix_suggestion: string | null;
}

interface IssueAnalysisProps {
  issues: AccessibilityIssue[];
  onIssueUpdate: (issueId: string, updates: Partial<AccessibilityIssue>) => void;
}

const IssueAnalysis = ({ issues, onIssueUpdate }: IssueAnalysisProps) => {
  const { toast } = useToast();
  const [analyzingIssues, setAnalyzingIssues] = useState<Set<string>>(new Set());

  const analyzeIssue = async (issue: AccessibilityIssue) => {
    if (analyzingIssues.has(issue.id)) return;

    setAnalyzingIssues(prev => new Set(prev).add(issue.id));

    try {
      const { data, error } = await supabase.functions.invoke('analyze-issues', {
        body: { issueId: issue.id }
      });

      if (error) throw error;

      // Update the local state with AI analysis
      onIssueUpdate(issue.id, {
        ai_explanation: data.analysis.explanation,
        ai_fix_suggestion: data.analysis.fixSuggestion
      });

      toast({
        title: 'AI-Analyse abgeschlossen',
        description: 'Das Issue wurde erfolgreich analysiert.',
      });
    } catch (error) {
      console.error('Error analyzing issue:', error);
      toast({
        title: 'Fehler bei der AI-Analyse',
        description: 'Die AI-Analyse konnte nicht durchgeführt werden.',
        variant: 'destructive'
      });
    } finally {
      setAnalyzingIssues(prev => {
        const newSet = new Set(prev);
        newSet.delete(issue.id);
        return newSet;
      });
    }
  };

  const getImpactBadge = (impact: string) => {
    const variants = {
      critical: { variant: 'destructive' as const, label: 'Kritisch' },
      serious: { variant: 'destructive' as const, label: 'Schwerwiegend' },
      moderate: { variant: 'secondary' as const, label: 'Mäßig' },
      minor: { variant: 'outline' as const, label: 'Gering' }
    };

    const config = variants[impact as keyof typeof variants] || variants.minor;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const hasAIAnalysis = (issue: AccessibilityIssue) => {
    return issue.ai_explanation || issue.ai_fix_suggestion;
  };

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Card key={issue.id} className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">{issue.rule_id}</CardTitle>
                {getImpactBadge(issue.impact)}
                {hasAIAnalysis(issue) && (
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Analysiert
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {!hasAIAnalysis(issue) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => analyzeIssue(issue)}
                    disabled={analyzingIssues.has(issue.id)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {analyzingIssues.has(issue.id) ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    AI-Analyse
                  </Button>
                )}
                {issue.help_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(issue.help_url!, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <CardDescription>{issue.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Original Issue Information */}
            {issue.help_text && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">WCAG-Hilfe</h4>
                    <p className="text-sm text-blue-800">{issue.help_text}</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Explanation */}
            {issue.ai_explanation && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900 mb-1">AI-Erklärung</h4>
                    <p className="text-sm text-purple-800 whitespace-pre-wrap">{issue.ai_explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Fix Suggestion */}
            {issue.ai_fix_suggestion && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Lösungsvorschlag</h4>
                    <div className="text-sm text-green-800 whitespace-pre-wrap">{issue.ai_fix_suggestion}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Details */}
            {(issue.target_element || issue.html_snippet) && (
              <div className="space-y-2">
                {issue.target_element && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                      <Code className="w-4 h-4 mr-1" />
                      Betroffenes Element
                    </h4>
                    <code className="text-xs bg-gray-100 p-2 rounded block font-mono">
                      {issue.target_element}
                    </code>
                  </div>
                )}
                
                {issue.html_snippet && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">HTML-Code</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto font-mono">
                      {issue.html_snippet}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IssueAnalysis;
