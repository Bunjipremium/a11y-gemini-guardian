
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  ExternalLink,
  Code,
  Info,
  Lightbulb,
  PlayCircle,
  Pause,
  Filter,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  wcag_level?: string;
  wcag_principle?: string;
  wcag_guideline?: string;
  wcag_reference?: string;
}

interface IssueAnalysisProps {
  issues: AccessibilityIssue[];
  onIssueUpdate: (issueId: string, updates: Partial<AccessibilityIssue>) => void;
  onBatchAnalysis?: (issues: AccessibilityIssue[]) => Promise<void>;
}

interface BatchAnalysisState {
  isRunning: boolean;
  currentIndex: number;
  total: number;
  completed: number;
  failed: number;
  isPaused: boolean;
}

const IssueAnalysis = ({ issues, onIssueUpdate, onBatchAnalysis }: IssueAnalysisProps) => {
  const { toast } = useToast();
  const [analyzingIssues, setAnalyzingIssues] = useState<Set<string>>(new Set());
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>('all');
  const [batchState, setBatchState] = useState<BatchAnalysisState>({
    isRunning: false,
    currentIndex: 0,
    total: 0,
    completed: 0,
    failed: 0,
    isPaused: false
  });

  // Filter issues based on selected criteria
  const filteredIssues = issues.filter(issue => {
    if (selectedImpact !== 'all' && issue.impact !== selectedImpact) return false;
    if (selectedLevel !== 'all' && issue.wcag_level !== selectedLevel) return false;
    if (selectedPrinciple !== 'all' && issue.wcag_principle !== selectedPrinciple) return false;
    return true;
  });

  // Get unique values for filters
  const uniqueImpacts = [...new Set(issues.map(issue => issue.impact))];
  const uniqueLevels = [...new Set(issues.map(issue => issue.wcag_level).filter(Boolean))];
  const uniquePrinciples = [...new Set(issues.map(issue => issue.wcag_principle).filter(Boolean))];

  const analyzeIssue = async (issue: AccessibilityIssue) => {
    if (analyzingIssues.has(issue.id)) return;

    setAnalyzingIssues(prev => new Set(prev).add(issue.id));

    try {
      const { data, error } = await supabase.functions.invoke('analyze-issues', {
        body: { issueId: issue.id }
      });

      if (error) throw error;

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

  const batchAnalyzeIssues = async () => {
    const unanalyzedIssues = filteredIssues.filter(issue => !issue.ai_explanation && !issue.ai_fix_suggestion);
    
    if (unanalyzedIssues.length === 0) {
      toast({
        title: 'Bereits analysiert',
        description: 'Alle sichtbaren Issues wurden bereits von der AI analysiert.',
      });
      return;
    }

    setBatchState({
      isRunning: true,
      currentIndex: 0,
      total: unanalyzedIssues.length,
      completed: 0,
      failed: 0,
      isPaused: false
    });

    toast({
      title: 'Batch AI-Analyse gestartet',
      description: `Analysiere ${unanalyzedIssues.length} Issues...`,
    });

    for (let i = 0; i < unanalyzedIssues.length; i++) {
      if (batchState.isPaused) break;

      const issue = unanalyzedIssues[i];
      setBatchState(prev => ({ ...prev, currentIndex: i + 1 }));

      try {
        const { data, error } = await supabase.functions.invoke('analyze-issues', {
          body: { issueId: issue.id }
        });

        if (!error && data?.analysis) {
          await onIssueUpdate(issue.id, {
            ai_explanation: data.analysis.explanation,
            ai_fix_suggestion: data.analysis.fixSuggestion
          });
          setBatchState(prev => ({ ...prev, completed: prev.completed + 1 }));
        } else {
          setBatchState(prev => ({ ...prev, failed: prev.failed + 1 }));
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error analyzing issue ${issue.id}:`, error);
        setBatchState(prev => ({ ...prev, failed: prev.failed + 1 }));
      }
    }

    setBatchState(prev => ({ ...prev, isRunning: false }));
    toast({
      title: 'Batch AI-Analyse abgeschlossen',
      description: `${batchState.completed} Issues erfolgreich analysiert, ${batchState.failed} fehlgeschlagen.`,
    });
  };

  const pauseBatchAnalysis = () => {
    setBatchState(prev => ({ ...prev, isPaused: true, isRunning: false }));
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

  const getWcagLevelBadge = (level: string) => {
    const colorMap = {
      'A': 'bg-green-100 text-green-800',
      'AA': 'bg-blue-100 text-blue-800',
      'AAA': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={colorMap[level as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'}>
        WCAG {level}
      </Badge>
    );
  };

  const getPrincipleIcon = (principle: string) => {
    const iconMap = {
      'Wahrnehmbar': '👁️',
      'Bedienbar': '🖱️',
      'Verständlich': '🧠',
      'Robust': '🔧'
    };
    return iconMap[principle as keyof typeof iconMap] || '📋';
  };

  const hasAIAnalysis = (issue: AccessibilityIssue) => {
    return issue.ai_explanation || issue.ai_fix_suggestion;
  };

  const unanalyzedCount = filteredIssues.filter(issue => !hasAIAnalysis(issue)).length;
  const batchProgress = batchState.total > 0 ? (batchState.currentIndex / batchState.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Enhanced Filter Controls */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter & Kategorisierung</span>
          </CardTitle>
          <CardDescription>
            Filtern Sie Issues nach Schweregrad, WCAG-Level und Prinzip
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Schweregrad</label>
              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Schweregrade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Schweregrade</SelectItem>
                  {uniqueImpacts.map(impact => (
                    <SelectItem key={impact} value={impact}>
                      {impact === 'critical' ? 'Kritisch' :
                       impact === 'serious' ? 'Schwerwiegend' :
                       impact === 'moderate' ? 'Mäßig' : 'Gering'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">WCAG Level</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Level</SelectItem>
                  {uniqueLevels.map(level => (
                    <SelectItem key={level} value={level!}>
                      WCAG {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">WCAG Prinzip</label>
              <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Prinzipien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Prinzipien</SelectItem>
                  {uniquePrinciples.map(principle => (
                    <SelectItem key={principle} value={principle!}>
                      {getPrincipleIcon(principle!)} {principle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <span>
              Zeige {filteredIssues.length} von {issues.length} Issues
            </span>
            {filteredIssues.length !== issues.length && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedImpact('all');
                  setSelectedLevel('all');
                  setSelectedPrinciple('all');
                }}
              >
                Filter zurücksetzen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Batch Analysis Controls */}
      {unanalyzedCount > 0 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-purple-900">Batch AI-Analyse</h3>
                <p className="text-sm text-purple-700">
                  {unanalyzedCount} sichtbare Issues können analysiert werden
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {!batchState.isRunning && !batchState.isPaused && (
                  <Button
                    onClick={batchAnalyzeIssues}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Gefilterte analysieren
                  </Button>
                )}
                {batchState.isRunning && (
                  <Button
                    onClick={pauseBatchAnalysis}
                    variant="outline"
                    className="border-purple-600 text-purple-600"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pausieren
                  </Button>
                )}
              </div>
            </div>

            {(batchState.isRunning || batchState.isPaused) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-purple-700">
                  <span>Fortschritt: {batchState.currentIndex} von {batchState.total}</span>
                  <span>Erfolgreich: {batchState.completed} | Fehlgeschlagen: {batchState.failed}</span>
                </div>
                <Progress value={batchProgress} className="h-2" />
                {batchState.isPaused && (
                  <p className="text-sm text-orange-600">Analyse pausiert</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Individual Issues */}
      {filteredIssues.map((issue) => (
        <Card key={issue.id} className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{issue.rule_id}</CardTitle>
                  {getImpactBadge(issue.impact)}
                  {issue.wcag_level && getWcagLevelBadge(issue.wcag_level)}
                  {hasAIAnalysis(issue) && (
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI-Analysiert
                    </Badge>
                  )}
                </div>

                {/* WCAG Information */}
                {(issue.wcag_principle || issue.wcag_guideline) && (
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {issue.wcag_principle && (
                      <div className="flex items-center space-x-1">
                        <span>{getPrincipleIcon(issue.wcag_principle)}</span>
                        <span>{issue.wcag_principle}</span>
                      </div>
                    )}
                    {issue.wcag_guideline && (
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{issue.wcag_guideline}</span>
                      </div>
                    )}
                    {issue.wcag_reference && (
                      <Badge variant="outline" className="text-xs">
                        {issue.wcag_reference}
                      </Badge>
                    )}
                  </div>
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

      {filteredIssues.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Keine Issues gefunden
            </h3>
            <p className="text-gray-600">
              Mit den aktuellen Filtern wurden keine Issues gefunden.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedImpact('all');
                setSelectedLevel('all');
                setSelectedPrinciple('all');
              }}
            >
              Filter zurücksetzen
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IssueAnalysis;
