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
  FileText
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
        <div className="flex items-center justify-center h-64">
          <Card>
            <CardContent className="text-center">
              <h2>Scan nicht gefunden</h2>
              <p>Der angeforderte Scan existiert nicht.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Scan Ergebnisse
            </h1>
            <p className="text-gray-600 mt-2">
              Detaillierte Analyse der Website-Accessibility
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => navigate('/websites')} className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Websites verwalten</span>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <Activity className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Übersicht</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Seiten</span>
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Issues</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>WCAG 2.2</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Expert Report</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview 
              stats={{
                totalWebsites: 1,
                totalScans: 1,
                totalIssues: scan.total_issues,
                criticalIssues: 5,
                averageIssuesPerPage: 2,
                complianceScore: 75,
                trendsData: {
                  scansThisWeek: 1,
                  issuesThisWeek: 10,
                  improvement: 3
                }
              }}
              recentScans={[scan]}
              onNavigateToScan={(scanId) => navigate(`/scan/${scanId}`)}
            />
            <ExportActions 
              scan={scan}
              scanResults={scanResults}
              selectedResult={selectedResult}
              issues={issues}
            />
          </TabsContent>

          <TabsContent value="pages">
            <DashboardWebsites 
              websites={[scan.website!]}
              stats={{
                totalWebsites: 1,
                totalScans: 1,
                totalIssues: scan.total_issues
              }}
              onNavigateToWebsite={(websiteId) => navigate(`/websites`)}
            />
          </TabsContent>

          <TabsContent value="issues">
            <IssueAnalysis 
              issues={issues}
              onIssueUpdate={handleIssueUpdate}
            />
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>WCAG 2.2 Compliance</CardTitle>
                <CardDescription>
                  Detaillierte Analyse der WCAG 2.2 Konformität
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>In Arbeit...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report">
            <ReportGenerator scan={scan} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ScanResults;
