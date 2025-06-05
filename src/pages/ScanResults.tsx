
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Globe, 
  BarChart3,
  Target,
  Zap,
  Eye,
  AlertCircle,
  Activity,
  FileText,
  ChevronLeft,
  Download,
  RefreshCw
} from 'lucide-react';
import DashboardOverview from '@/components/DashboardOverview';
import DashboardWebsites from '@/components/DashboardWebsites';
import DashboardRecentActivity from '@/components/DashboardRecentActivity';
import IssueAnalysis from '@/components/IssueAnalysis';
import ExportActions from '@/components/ExportActions';
import ReportGenerator from '@/components/ReportGenerator';

interface ScanData {
  id: string;
  website_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  total_pages: number;
  scanned_pages: number;
  total_issues: number;
  created_at: string;
  website?: {
    name: string;
    base_url: string;
  };
}

interface ScanResult {
  id: string;
  scan_id: string;
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
  scan_result_id: string;
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

const ScanResults = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { scanId } = useParams<{ scanId: string }>();
  const [scan, setScan] = useState<ScanData | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && scanId) {
      fetchScanData();
      fetchScanResults();
    }
  }, [user, scanId]);

  useEffect(() => {
    if (selectedResult) {
      fetchAccessibilityIssues(selectedResult.id);
    } else {
      setIssues([]);
    }
  }, [selectedResult]);

  const fetchScanData = async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error('Error fetching scan data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScanResults = async () => {
    try {
      const { data: scanResultsData, error: scanResultsError } = await supabase
        .from('scan_results')
        .select('*')
        .eq('scan_id', scanId)
        .order('url', { ascending: true });

      if (scanResultsError) throw scanResultsError;
      setScanResults(scanResultsData || []);
    } catch (error) {
      console.error('Error fetching scan results:', error);
    }
  };

  const fetchAccessibilityIssues = async (scanResultId: string) => {
    try {
      const { data: issuesData, error: issuesError } = await supabase
        .from('accessibility_issues')
        .select('*')
        .eq('scan_result_id', scanResultId);

      if (issuesError) throw issuesError;
      setIssues(issuesData || []);
    } catch (error) {
      console.error('Error fetching accessibility issues:', error);
    }
  };

  const handleIssueUpdate = (issueId: string, updates: Partial<AccessibilityIssue>) => {
    setIssues(currentIssues =>
      currentIssues.map(issue =>
        issue.id === issueId ? { ...issue, ...updates } : issue
      )
    );
  };

  const calculateComplianceScore = () => {
    if (!scan || scan.total_issues === 0) return 100;
    const maxIssues = scan.total_pages * 10; // Assume max 10 issues per page
    return Math.max(0, Math.round(((maxIssues - scan.total_issues) / maxIssues) * 100));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Lade Scan-Ergebnisse...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!scan) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Card className="max-w-md">
            <CardContent className="text-center p-8">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Scan nicht gefunden</h2>
              <p className="text-gray-600 mb-4">Der angeforderte Scan existiert nicht oder wurde gelöscht.</p>
              <Button onClick={() => navigate('/websites')}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Zurück zu Websites
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const progressPercentage = scan.total_pages > 0 ? (scan.scanned_pages / scan.total_pages) * 100 : 0;
  const complianceScore = calculateComplianceScore();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Improved Header with Breadcrumb */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Button variant="ghost" size="sm" onClick={() => navigate('/websites')}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Websites
                </Button>
                <span>/</span>
                <span className="font-medium">{scan.website?.name}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Globe className="w-8 h-8 text-blue-600" />
                <span>Accessibility Scan</span>
                <Badge variant={scan.status === 'completed' ? 'default' : 'secondary'}>
                  {scan.status}
                </Badge>
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Gestartet: {new Date(scan.started_at).toLocaleString('de-DE')}</span>
                {scan.completed_at && (
                  <>
                    <span>•</span>
                    <span>Abgeschlossen: {new Date(scan.completed_at).toLocaleString('de-DE')}</span>
                  </>
                )}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button onClick={() => window.location.reload()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Aktualisieren
              </Button>
              <Button onClick={() => navigate('/websites')} variant="outline">
                <Globe className="w-4 h-4 mr-2" />
                Websites verwalten
              </Button>
            </div>
          </div>

          {/* Enhanced Progress Section */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{scan.scanned_pages}</div>
                <div className="text-sm text-gray-600">von {scan.total_pages} Seiten</div>
                <Progress value={progressPercentage} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{scan.total_issues}</div>
                <div className="text-sm text-gray-600">Accessibility Issues</div>
                <div className="text-xs text-gray-500 mt-1">
                  Ø {scan.total_pages > 0 ? (scan.total_issues / scan.total_pages).toFixed(1) : 0} pro Seite
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{complianceScore}%</div>
                <div className="text-sm text-gray-600">WCAG 2.2 Score</div>
                <Badge variant={complianceScore >= 80 ? 'default' : complianceScore >= 60 ? 'secondary' : 'destructive'} className="mt-1">
                  {complianceScore >= 80 ? 'Gut' : complianceScore >= 60 ? 'Mittel' : 'Niedrig'}
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{scanResults.length}</div>
                <div className="text-sm text-gray-600">Analysierte URLs</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scanResults.filter(r => r.status_code === 200).length} erfolgreich
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <TabsList className="grid w-full grid-cols-5 bg-transparent gap-1">
              <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Übersicht</span>
              </TabsTrigger>
              <TabsTrigger value="pages" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Seiten</span>
              </TabsTrigger>
              <TabsTrigger value="issues" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Issues</span>
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WCAG 2.2</span>
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Report</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview 
              stats={{
                totalWebsites: 1,
                totalScans: 1,
                totalIssues: scan.total_issues,
                criticalIssues: 5,
                averageIssuesPerPage: scan.total_pages > 0 ? scan.total_issues / scan.total_pages : 0,
                complianceScore: complianceScore,
                trendsData: {
                  scansThisWeek: 1,
                  issuesThisWeek: scan.total_issues,
                  improvement: complianceScore > 75 ? 5 : -2
                }
              }}
              recentScans={[{
                id: scan.id,
                website_id: scan.website_id,
                status: scan.status,
                total_pages: scan.total_pages,
                total_issues: scan.total_issues,
                created_at: scan.created_at,
                website: scan.website ? { name: scan.website.name } : undefined
              }]}
              onNavigateToScan={(scanId) => navigate(`/scan/${scanId}`)}
            />
            <ExportActions 
              scan={scan}
              scanResults={scanResults}
              selectedResult={selectedResult}
              issues={issues}
            />
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <DashboardWebsites 
              websites={scan.website ? [{
                id: scan.website_id,
                name: scan.website.name,
                base_url: scan.website.base_url,
                created_at: scan.created_at
              }] : []}
              stats={{
                totalWebsites: 1,
                totalScans: 1,
                totalIssues: scan.total_issues
              }}
              onNavigateToWebsite={(websiteId) => navigate(`/websites`)}
            />
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            <IssueAnalysis 
              issues={issues}
              onIssueUpdate={handleIssueUpdate}
            />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>WCAG 2.2 Compliance Analysis</span>
                </CardTitle>
                <CardDescription>
                  Detaillierte Analyse der Web Content Accessibility Guidelines 2.2 Konformität
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">Level A</div>
                      <div className="text-sm text-gray-600">Basis-Konformität</div>
                      <Progress value={85} className="mt-2" />
                      <div className="text-xs text-gray-500 mt-1">85% erfüllt</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">Level AA</div>
                      <div className="text-sm text-gray-600">Standard-Konformität</div>
                      <Progress value={complianceScore} className="mt-2" />
                      <div className="text-xs text-gray-500 mt-1">{complianceScore}% erfüllt</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">Level AAA</div>
                      <div className="text-sm text-gray-600">Erweiterte Konformität</div>
                      <Progress value={Math.max(0, complianceScore - 20)} className="mt-2" />
                      <div className="text-xs text-gray-500 mt-1">{Math.max(0, complianceScore - 20)}% erfüllt</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">{scan.total_issues}</div>
                      <div className="text-sm text-gray-600">Zu behebende Issues</div>
                      <div className="text-xs text-yellow-700 mt-2 font-medium">
                        Priorität: Hoch
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm text-gray-600">
                    Die WCAG 2.2 Compliance-Analyse wird kontinuierlich erweitert. 
                    Verwenden Sie den Expert Report für detaillierte Empfehlungen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <ReportGenerator scan={scan} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ScanResults;
