
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Plus,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Website {
  id: string;
  name: string;
  base_url: string;
  created_at: string;
}

interface Scan {
  id: string;
  status: string;
  total_pages: number;
  scanned_pages: number;
  total_issues: number;
  created_at: string;
  websites: {
    name: string;
    base_url: string;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [stats, setStats] = useState({
    totalWebsites: 0,
    totalScans: 0,
    totalIssues: 0,
    completedScans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch websites
      const { data: websitesData } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent scans
      const { data: scansData } = await supabase
        .from('scans')
        .select(`
          *,
          websites (name, base_url)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate stats
      const { count: websiteCount } = await supabase
        .from('websites')
        .select('*', { count: 'exact', head: true });

      const { count: scanCount } = await supabase
        .from('scans')
        .select('*', { count: 'exact', head: true });

      const { count: completedCount } = await supabase
        .from('scans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      const { data: issuesSum } = await supabase
        .from('scans')
        .select('total_issues')
        .eq('status', 'completed');

      const totalIssues = issuesSum?.reduce((sum, scan) => sum + (scan.total_issues || 0), 0) || 0;

      setWebsites(websitesData || []);
      setRecentScans(scansData || []);
      setStats({
        totalWebsites: websiteCount || 0,
        totalScans: scanCount || 0,
        totalIssues,
        completedScans: completedCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Wartend' },
      running: { color: 'bg-blue-100 text-blue-800', text: 'Läuft' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Abgeschlossen' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Fehler' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Willkommen zurück!
            </h1>
            <p className="text-gray-600">
              Hier ist eine Übersicht Ihrer Accessibility-Scans
            </p>
          </div>
          <Button 
            onClick={() => navigate('/websites')}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Website hinzufügen</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Websites
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWebsites}</div>
              <p className="text-xs text-muted-foreground">
                Registrierte Domains
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Scans
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScans}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedScans} abgeschlossen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gefundene Issues
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIssues}</div>
              <p className="text-xs text-muted-foreground">
                Accessibility-Probleme
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Erfolgsrate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalScans > 0 ? Math.round((stats.completedScans / stats.totalScans) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Erfolgreiche Scans
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Websites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Letzte Websites</span>
              </CardTitle>
              <CardDescription>
                Ihre zuletzt hinzugefügten Websites
              </CardDescription>
            </CardHeader>
            <CardContent>
              {websites.length === 0 ? (
                <div className="text-center py-6">
                  <Globe className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Keine Websites
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Fügen Sie Ihre erste Website hinzu, um zu beginnen.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => navigate('/websites')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Website hinzufügen
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {websites.map((website) => (
                    <div
                      key={website.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{website.name}</p>
                        <p className="text-sm text-gray-500">{website.base_url}</p>
                      </div>
                      <Badge variant="outline">
                        {new Date(website.created_at).toLocaleDateString('de-DE')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Letzte Scans</span>
              </CardTitle>
              <CardDescription>
                Ihre neuesten Accessibility-Scans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentScans.length === 0 ? (
                <div className="text-center py-6">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Keine Scans
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Starten Sie Ihren ersten Scan einer Website.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentScans.map((scan) => (
                    <div
                      key={scan.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {scan.websites?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {scan.scanned_pages}/{scan.total_pages} Seiten
                          {scan.total_issues > 0 && ` • ${scan.total_issues} Issues`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(scan.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
