
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Activity
} from 'lucide-react';
import DashboardOverview from '@/components/DashboardOverview';
import DashboardWebsites from '@/components/DashboardWebsites';
import DashboardRecentActivity from '@/components/DashboardRecentActivity';

interface Scan {
  id: string;
  website_id: string;
  status: string;
  total_pages: number;
  total_issues: number;
  created_at: string;
  website?: {
    name: string;
  };
}

interface Website {
  id: string;
  name: string;
  base_url: string;
  created_at: string;
}

interface DashboardStats {
  totalWebsites: number;
  totalScans: number;
  totalIssues: number;
  criticalIssues: number;
  averageIssuesPerPage: number;
  complianceScore: number;
  trendsData: {
    scansThisWeek: number;
    issuesThisWeek: number;
    improvement: number;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalWebsites: 0,
    totalScans: 0,
    totalIssues: 0,
    criticalIssues: 0,
    averageIssuesPerPage: 0,
    complianceScore: 0,
    trendsData: {
      scansThisWeek: 0,
      issuesThisWeek: 0,
      improvement: 0
    }
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
      const { data: websitesData, error: websitesError } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (websitesError) throw websitesError;
      setWebsites(websitesData || []);

      // Fetch recent scans
      const { data: scansData, error: scansError } = await supabase
        .from('scans')
        .select(`
          *,
          website:websites(name)
        `)
        .order('created_at', { ascending: false })
        .limit(8);

      if (scansError) throw scansError;
      setRecentScans(scansData || []);

      // Calculate comprehensive stats
      const totalWebsites = websitesData?.length || 0;
      const totalScans = scansData?.length || 0;
      const totalIssues = scansData?.reduce((sum, scan) => sum + (scan.total_issues || 0), 0) || 0;
      
      // Get critical issues from accessibility_issues table
      const { data: criticalIssuesData } = await supabase
        .from('accessibility_issues')
        .select('id')
        .eq('impact', 'critical');
      
      const criticalIssues = criticalIssuesData?.length || 0;
      
      // Calculate average issues per page
      const totalPages = scansData?.reduce((sum, scan) => sum + (scan.total_pages || 0), 0) || 0;
      const averageIssuesPerPage = totalPages > 0 ? Math.round(totalIssues / totalPages) : 0;
      
      // Calculate compliance score (simplified)
      const complianceScore = totalIssues > 0 ? Math.max(0, 100 - (criticalIssues * 10 + totalIssues * 2)) : 85;
      
      // Calculate trends (mock data for now)
      const scansThisWeek = scansData?.filter(scan => {
        const scanDate = new Date(scan.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return scanDate > weekAgo;
      }).length || 0;

      setStats({
        totalWebsites,
        totalScans,
        totalIssues,
        criticalIssues,
        averageIssuesPerPage,
        complianceScore,
        trendsData: {
          scansThisWeek,
          issuesThisWeek: Math.round(totalIssues * 0.3), // Mock calculation
          improvement: Math.random() * 10 + 5 // Mock improvement
        }
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Accessibility Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Umfassender Überblick über Ihre Website-Accessibility
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Übersicht</span>
            </TabsTrigger>
            <TabsTrigger value="websites" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Websites</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Aktivität</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview 
              stats={stats} 
              recentScans={recentScans}
              onNavigateToScan={(scanId) => navigate(`/scan/${scanId}`)}
            />
          </TabsContent>

          <TabsContent value="websites">
            <DashboardWebsites 
              websites={websites}
              stats={stats}
              onNavigateToWebsite={(websiteId) => navigate(`/websites`)}
            />
          </TabsContent>

          <TabsContent value="activity">
            <DashboardRecentActivity 
              recentScans={recentScans}
              onNavigateToScan={(scanId) => navigate(`/scan/${scanId}`)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
