import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface Scan {
  id: string;
  website_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  total_pages: number;
  total_issues: number;
  created_at: string;
  website?: {
    name: string;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentScans();
    }
  }, [user]);

  const fetchRecentScans = async () => {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select(`
          *,
          website:websites(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentScans(data || []);
    } catch (error) {
      console.error('Error fetching recent scans:', error);
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Überblick über Ihre Accessibility-Scans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Website Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Websites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                3
              </div>
              <p className="text-sm text-gray-600">
                Verwaltete Websites
              </p>
            </CardContent>
          </Card>

          {/* Total Scans */}
          <Card>
            <CardHeader>
              <CardTitle>Gesamte Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                12
              </div>
              <p className="text-sm text-gray-600">
                Durchgeführte Accessibility-Scans
              </p>
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Letzte Scans</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div 
                    key={scan.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => navigate(`/scan/${scan.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{scan.website?.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(scan.created_at).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={scan.status === 'completed' ? 'default' : 'secondary'}
                      >
                        {scan.status}
                      </Badge>
                      {scan.total_issues > 0 && (
                        <Badge variant="destructive">
                          {scan.total_issues} Issues
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {recentScans.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Noch keine Scans durchgeführt
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
