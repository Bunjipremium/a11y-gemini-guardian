import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import ScanDashboard from '@/components/ScanDashboard';
import ScanProgress from '@/components/ScanProgress';
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
  X,
  AlertCircle
} from 'lucide-react';
import ExportActions from '@/components/ExportActions';

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
  wcag_level: string | null;
  wcag_principle: string | null;
  wcag_guideline: string | null;
  wcag_reference: string | null;
}

// Separate type for dashboard analytics
interface DashboardIssueData {
  wcag_level: string | null;
  wcag_principle: string | null;
  impact: string;
  rule_id: string;
}

const ScanResults = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scan, setScan] = useState<ScanData | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [allIssues, setAllIssues] = useState<DashboardIssueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

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

      // Fetch all issues for dashboard analytics with proper typing
      if (resultsData && resultsData.length > 0) {
        const resultIds = resultsData.map(result => result.id);
        const { data: allIssuesData, error: allIssuesError } = await supabase
          .from('accessibility_issues')
          .select('wcag_level, wcag_principle, impact, rule_id')
          .in('scan_result_id', resultIds);

        if (!allIssuesError && allIssuesData) {
          setAllIssues(allIssuesData);
        }
      }

      // Auto-select first result with issues if none selected
      if (!selectedResult && resultsData && resultsData.length > 0) {
        const firstResultWithIssues = resultsData.find(result => result.total_issues > 0);
        if (firstResultWithIssues) {
          setSelectedResult(firstResultWithIssues);
          fetchIssues(firstResultWithIssues.id);
        }
      }
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
    // Switch to issues tab when a result is selected
    setActiveTab('issues');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'running':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const totalIssuesInScan = scanResults.reduce((sum, result) => sum + result.total_issues, 0);

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
        {/* Header with improved layout */}
        <div className="flex items-center justify-between">
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
              <p className="text-gray-600">{scan?.website.name}</p>
            </div>
          </div>
          
          {/* Quick stats */}
          {scan?.status === 'completed' && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-lg">{scanResults.length}</div>
                <div className="text-gray-500">Seiten</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-red-600">{totalIssuesInScan}</div>
                <div className="text-gray-500">Issues</div>
              </div>
            </div>
          )}
        </div>

        {/* Show Progress Component for running scans */}
        {scan?.status === 'running' && (
          <ScanProgress 
            scanId={scanId!} 
            onScanComplete={() => {
              fetchScanData();
              window.location.reload();
            }}
          />
        )}

        {/* Export Actions */}
        {scan?.status === 'completed' && (
          <ExportActions 
            scan={scan}
            scanResults={scanResults}
            selectedResult={selectedResult}
            issues={issues}
          />
        )}

        {/* Main Content Tabs - only show for completed scans */}
        {scan?.status === 'completed' && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="pages" className="flex items-center space-x-2">
                <List className="w-4 h-4" />
                <span>Seiten-Details</span>
              </TabsTrigger>
              <TabsTrigger value="issues" className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Issue-Analyse</span>
                {totalIssuesInScan > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    {totalIssuesInScan}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <ScanDashboard 
                scan={scan} 
                scanResults={scanResults} 
                allIssues={allIssues}
              />
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
                    <div className="space-y-4">
                      {/* Quick selection for pages with issues */}
                      {scanResults.filter(result => result.total_issues > 0).length > 0 && (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span className="font-medium text-yellow-800">Seiten mit Issues</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {scanResults
                              .filter(result => result.total_issues > 0)
                              .slice(0, 5)
                              .map((result) => (
                                <Button
                                  key={result.id}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResultClick(result)}
                                  className="h-auto py-2 px-3 text-left"
                                >
                                  <div>
                                    <div className="font-medium truncate max-w-[200px]">
                                      {result.title || new URL(result.url).pathname}
                                    </div>
                                    <div className="text-xs text-red-600">
                                      {result.total_issues} Issues
                                    </div>
                                  </div>
                                </Button>
                              ))}
                          </div>
                        </div>
                      )}

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
                              className={`cursor-pointer hover:bg-gray-50 ${
                                selectedResult?.id === result.id ? 'bg-blue-50 border-blue-200' : ''
                              }`}
                              onClick={() => handleResultClick(result)}
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Issues Tab - now always accessible */}
            <TabsContent value="issues">
              {totalIssuesInScan === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-lg font-medium text-green-600 mb-2">
                      Großartig! Keine Accessibility-Issues gefunden!
                    </h3>
                    <p className="text-gray-500">
                      Alle Seiten Ihrer Website erfüllen die grundlegenden Accessibility-Standards.
                    </p>
                  </CardContent>
                </Card>
              ) : !selectedResult ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>AI-Issue-Analyse</span>
                    </CardTitle>
                    <CardDescription>
                      Wählen Sie eine Seite aus der Seiten-Liste aus, um Issues zu analysieren
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        Keine Seite ausgewählt
                      </p>
                      <Button 
                        onClick={() => setActiveTab('pages')}
                        variant="outline"
                      >
                        <List className="w-4 h-4 mr-2" />
                        Zur Seiten-Übersicht
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>AI-Issue-Analyse</span>
                    </CardTitle>
                    <CardDescription>
                      Issues für {selectedResult.url}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('pages')}
                        className="ml-2"
                      >
                        Andere Seite wählen
                      </Button>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {issuesLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : issues.length === 0 ? (
                      <div className="text-center py-8 text-green-600">
                        <span className="text-2xl">🎉</span>
                        <p className="mt-2">Keine Accessibility-Issues auf dieser Seite gefunden!</p>
                      </div>
                    ) : (
                      <IssueAnalysis 
                        issues={issues} 
                        onIssueUpdate={handleIssueUpdate}
                      />
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Show message for pending/failed scans */}
        {(scan?.status === 'pending' || scan?.status === 'failed') && (
          <Card>
            <CardContent className="text-center py-12">
              <div className={getStatusColor(scan.status)}>
                {getStatusIcon(scan.status)}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                {scan.status === 'pending' ? 'Scan wird vorbereitet...' : 'Scan fehlgeschlagen'}
              </h3>
              <p className="text-gray-600">
                {scan.status === 'pending' 
                  ? 'Der Scan wird in Kürze gestartet. Bitte haben Sie einen Moment Geduld.' 
                  : 'Es ist ein Fehler beim Scannen aufgetreten. Bitte versuchen Sie es erneut.'}
              </p>
              {scan.status === 'failed' && (
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/websites')}
                >
                  Neuen Scan starten
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ScanResults;
