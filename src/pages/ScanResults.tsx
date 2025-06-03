
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface ScanData {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
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
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help_text: string | null;
  help_url: string | null;
  target_element: string | null;
  html_snippet: string | null;
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
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
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

        {/* Scan Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getStatusIcon(scan.status)}
                <span>Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge 
                  variant={scan.status === 'completed' ? 'default' : 'secondary'}
                  className="mb-2"
                >
                  {scan.status}
                </Badge>
                {scan.status === 'running' && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-gray-600">
                      {scan.scanned_pages} von {scan.total_pages} Seiten
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Gefundene Issues</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {scan.total_issues}
              </div>
              <p className="text-sm text-gray-600">
                Accessibility-Probleme gefunden
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gescannte Seiten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {scan.scanned_pages}
              </div>
              <p className="text-sm text-gray-600">
                von {scan.total_pages} Seiten
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Scan Results Table */}
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
            )}
          </CardContent>
        </Card>

        {/* Issues Detail */}
        {selectedResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Issues für {selectedResult.url}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {issuesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : issues.length === 0 ? (
                <div className="text-center py-8 text-green-600">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                  <p>Keine Accessibility-Issues gefunden!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div key={issue.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{issue.rule_id}</h4>
                          {getImpactBadge(issue.impact)}
                        </div>
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
                      <p className="text-gray-700 mb-2">{issue.description}</p>
                      {issue.help_text && (
                        <p className="text-sm text-gray-600 mb-2">{issue.help_text}</p>
                      )}
                      {issue.target_element && (
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Element:</span> {issue.target_element}
                        </div>
                      )}
                      {issue.html_snippet && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                          {issue.html_snippet}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ScanResults;
