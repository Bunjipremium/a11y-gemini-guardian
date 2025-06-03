
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import ScanDashboard from '@/components/ScanDashboard';
import IssueAnalysis from '@/components/IssueAnalysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  ExternalLink,
  BarChart3,
  List,
  Sparkles,
  Check,
  Clock,
  X
} from 'lucide-react';

interface ScanData {
  id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  total_pages: number;
  scanned_pages: number;
  total_issues: number;
  website: {
    name: string;
    base_url: string;
  };
}

interface ScanResult {
  id: string;
  url: string;
  title: string;
  status_code: number;
  load_time_ms: number;
  total_issues: number;
  critical_issues: number;
  serious_issues: number;
  moderate_issues: number;
  minor_issues: number;
}

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

const ScanResults = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scan, setScan] = useState<ScanData | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState(false);

  useEffect(() => {
    if (scanId) {
      fetchScanData();
    }
  }, [scanId]);

  const fetchScanData = async () => {
    try {
      // Fetch scan data with website info
      const { data: scanData, error: scanError } = await supabase
        .from('scans')
        .select(`
          *,
          website:websites(name, base_url)
        `)
        .eq('id', scanId)
        .single();

      if (scanError) throw scanError;
      setScan(scanData);

      // Fetch scan results
      const { data: resultsData, error: resultsError } = await supabase
        .from('scan_results')
        .select('*')
        .eq('scan_id', scanId)
        .order('total_issues', { ascending: false });

      if (resultsError) throw resultsError;
      setScanResults(resultsData || []);
    } catch (error) {
      console.error('Error fetching scan data:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Laden der Scan-Ergebnisse',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchIssues = async (resultId: string) => {
    setIssuesLoading(true);
    try {
      const { data, error } = await supabase
        .from('accessibility_issues')
        .select('*')
        .eq('scan_result_id', resultId)
        .order('impact', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Laden der Issues',
        variant: 'destructive'
      });
    } finally {
      setIssuesLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    const variants = {
      critical: 'destructive',
      serious: 'destructive',
      moderate: 'secondary',
      minor: 'outline'
    } as const;

    return (
      <Badge variant={variants[impact as keyof typeof variants] || 'outline'}>
        {impact}
      </Badge>
    );
  };

  const handleResultClick = (result: ScanResult) => {
    setSelectedResult(result);
    fetchIssues(result.id);
  };

  const handleIssueUpdate = async (issueId: string, updates: Partial<AccessibilityIssue>) => {
    // Update local state immediately for UI responsiveness
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, ...updates } : issue
    ));

    // Update database with AI analysis results
    if (updates.ai_explanation || updates.ai_fix_suggestion) {
      try {
        const { error } = await supabase
          .from('accessibility_issues')
          .update({
            ai_explanation: updates.ai_explanation,
            ai_fix_suggestion: updates.ai_fix_suggestion,
            analyzed_at: new Date().toISOString()
          })
          .eq('id', issueId);

        if (error) {
          console.error('Error updating issue in database:', error);
          toast({
            title: 'Warnung',
            description: 'AI-Analyse wurde lokal gespeichert, aber nicht in der Datenbank.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Database update failed:', error);
      }
    }
  };

  const analyzeAllIssues = async () => {
    if (!selectedResult) return;

    const unanalyzedIssues = issues.filter(issue => !issue.ai_explanation && !issue.ai_fix_suggestion);
    
    if (unanalyzedIssues.length === 0) {
      toast({
        title: 'Bereits analysiert',
        description: 'Alle Issues wurden bereits von der AI analysiert.',
      });
      return;
    }

    toast({
      title: 'AI-Analyse gestartet',
      description: `Analysiere ${unanalyzedIssues.length} Issues...`,
    });

    // Analyze issues in batches to avoid overwhelming the API
    for (const issue of unanalyzedIssues) {
      try {
        const { data, error } = await supabase.functions.invoke('analyze-issues', {
          body: { issueId: issue.id }
        });

        if (!error && data?.analysis) {
          await handleIssueUpdate(issue.id, {
            ai_explanation: data.analysis.explanation,
            ai_fix_suggestion: data.analysis.fixSuggestion
          });
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error analyzing issue ${issue.id}:`, error);
      }
    }

    toast({
      title: 'AI-Analyse abgeschlossen',
      description: 'Alle Issues wurden analysiert.',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!scan) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Scan nicht gefunden
          </h2>
          <Button onClick={() => navigate('/websites')}>
            Zurück zu Websites
          </Button>
        </div>
      </Layout>
    );
  }

  const progress = scan.total_pages > 0 ? (scan.scanned_pages / scan.total_pages) * 100 : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/websites')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zurück</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Scan-Ergebnisse
            </h1>
            <p className="text-gray-600">{scan.website.name}</p>
          </div>
        </div>

        {/* Progress for running scans */}
        {scan.status === 'running' && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scan läuft...</span>
                  <span>{scan.scanned_pages} von {scan.total_pages} Seiten</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center space-x-2">
              <List className="w-4 h-4" />
              <span>Seiten-Details</span>
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center space-x-2" disabled={!selectedResult}>
              <Sparkles className="w-4 h-4" />
              <span>Issue-Analyse</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <ScanDashboard scan={scan} scanResults={scanResults} />
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Seiten-Ergebnisse</CardTitle>
                <CardDescription>
                  Klicken Sie auf eine Seite, um detaillierte Issues anzuzeigen
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Keine Scan-Ergebnisse vorhanden
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead>Titel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ladezeit</TableHead>
                        <TableHead>Issues</TableHead>
                        <TableHead>Kritisch</TableHead>
                        <TableHead>Schwerwiegend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scanResults.map((result) => (
                        <TableRow 
                          key={result.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            setSelectedResult(result);
                            fetchIssues(result.id);
                          }}
                        >
                          <TableCell className="max-w-xs">
                            <div className="flex items-center space-x-2">
                              <span className="truncate">{result.url}</span>
                              <ExternalLink 
                                className="w-4 h-4 text-gray-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(result.url, '_blank');
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {result.title || 'Kein Titel'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={result.status_code === 200 ? 'default' : 'destructive'}>
                              {result.status_code}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.load_time_ms}ms</TableCell>
                          <TableCell>
                            <Badge variant={result.total_issues > 0 ? 'destructive' : 'default'}>
                              {result.total_issues}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {result.critical_issues > 0 && (
                              <Badge variant="destructive">{result.critical_issues}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.serious_issues > 0 && (
                              <Badge variant="destructive">{result.serious_issues}</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues">
            {selectedResult ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>AI-Issue-Analyse</span>
                      </CardTitle>
                      <CardDescription>
                        Issues für {selectedResult.url}
                      </CardDescription>
                    </div>
                    {issues.length > 0 && (
                      <Button
                        onClick={analyzeAllIssues}
                        variant="outline"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Alle analysieren
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {issuesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : issues.length === 0 ? (
                    <div className="text-center py-8 text-green-600">
                      <span className="text-2xl">🎉</span>
                      <p className="mt-2">Keine Accessibility-Issues gefunden!</p>
                    </div>
                  ) : (
                    <IssueAnalysis 
                      issues={issues} 
                      onIssueUpdate={handleIssueUpdate}
                    />
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    Wählen Sie eine Seite aus, um Issues zu analysieren
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ScanResults;
