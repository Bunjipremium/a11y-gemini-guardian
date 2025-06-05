
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  PlayCircle,
  Eye,
  Calendar,
  BarChart3
} from 'lucide-react';

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

interface DashboardRecentActivityProps {
  recentScans: Scan[];
  onNavigateToScan: (scanId: string) => void;
}

const DashboardRecentActivity = ({ recentScans, onNavigateToScan }: DashboardRecentActivityProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': 
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running': 
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case 'failed': 
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: 
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'running': return 'bg-blue-50 border-blue-200';
      case 'failed': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getIssuesSeverity = (totalIssues: number) => {
    if (totalIssues === 0) return { label: 'Perfekt', variant: 'default' as const, color: 'text-green-600' };
    if (totalIssues <= 5) return { label: 'Gut', variant: 'secondary' as const, color: 'text-yellow-600' };
    if (totalIssues <= 15) return { label: 'Bedarf', variant: 'destructive' as const, color: 'text-orange-600' };
    return { label: 'Kritisch', variant: 'destructive' as const, color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{recentScans.length}</div>
            <p className="text-sm text-gray-600">Gesamte Scans</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">
              {recentScans.filter(scan => scan.status === 'completed').length}
            </div>
            <p className="text-sm text-gray-600">Abgeschlossen</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <PlayCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">
              {recentScans.filter(scan => scan.status === 'running').length}
            </div>
            <p className="text-sm text-gray-600">Laufend</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">
              {recentScans.reduce((sum, scan) => sum + (scan.total_issues || 0), 0)}
            </div>
            <p className="text-sm text-gray-600">Gesamt Issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Scan-Aktivitäten</span>
          </CardTitle>
          <CardDescription>
            Chronologische Übersicht Ihrer Accessibility-Scans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentScans.length > 0 ? (
            <div className="space-y-4">
              {recentScans.map((scan, index) => {
                const severity = getIssuesSeverity(scan.total_issues || 0);
                
                return (
                  <div 
                    key={scan.id} 
                    className={`p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer ${getStatusColor(scan.status)}`}
                    onClick={() => onNavigateToScan(scan.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(scan.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {scan.website?.name || 'Unbekannte Website'}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{scan.total_pages || 0} Seiten gescannt</span>
                            <span>•</span>
                            <span>{new Date(scan.created_at).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${severity.color}`}>
                            {scan.total_issues || 0}
                          </div>
                          <div className="text-xs text-gray-500">Issues</div>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <Badge variant={scan.status === 'completed' ? 'default' : 'secondary'}>
                            {scan.status}
                          </Badge>
                          {scan.total_issues !== undefined && (
                            <Badge variant={severity.variant}>
                              {severity.label}
                            </Badge>
                          )}
                        </div>
                        
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Noch keine Scan-Aktivitäten</h3>
              <p className="text-gray-600 mb-4">
                Starten Sie Ihren ersten Accessibility-Scan, um hier Aktivitäten zu sehen.
              </p>
              <Button>
                <PlayCircle className="w-4 h-4 mr-2" />
                Ersten Scan starten
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardRecentActivity;
