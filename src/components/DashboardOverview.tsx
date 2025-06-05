
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Globe, 
  Target,
  Zap,
  Eye,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardOverviewProps {
  stats: {
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
  };
  recentScans: Array<{
    id: string;
    website_id: string;
    status: string;
    total_pages: number;
    total_issues: number;
    created_at: string;
    website?: {
      name: string;
    };
  }>;
  onNavigateToScan: (scanId: string) => void;
}

const DashboardOverview = ({ stats, recentScans, onNavigateToScan }: DashboardOverviewProps) => {
  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceStatus = (score: number) => {
    if (score >= 80) return 'Gut';
    if (score >= 60) return 'Verbesserungsbedarf';
    return 'Kritisch';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Compliance Score */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Target className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getComplianceColor(stats.complianceScore)}`}>
              {stats.complianceScore}%
            </div>
            <div className="flex items-center justify-between mt-2">
              <Badge variant={stats.complianceScore >= 80 ? 'default' : 'destructive'}>
                {getComplianceStatus(stats.complianceScore)}
              </Badge>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +{stats.trendsData.improvement.toFixed(1)}%
              </div>
            </div>
            <Progress value={stats.complianceScore} className="mt-3" />
          </CardContent>
        </Card>

        {/* Critical Issues */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kritische Issues</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.criticalIssues}</div>
            <p className="text-xs text-muted-foreground">
              Sofortige Aufmerksamkeit erforderlich
            </p>
            <div className="mt-2">
              <Badge variant="destructive">
                Hohe Priorität
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Total Issues */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Issues</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.totalIssues}</div>
            <p className="text-xs text-muted-foreground">
              Durchschnitt: {stats.averageIssuesPerPage} pro Seite
            </p>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <BarChart3 className="w-3 h-3 mr-1" />
              {stats.trendsData.issuesThisWeek} diese Woche
            </div>
          </CardContent>
        </Card>

        {/* Active Scans */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Überwachung</CardTitle>
            <Eye className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.totalWebsites}</div>
            <p className="text-xs text-muted-foreground">
              Websites überwacht
            </p>
            <div className="flex items-center text-sm text-blue-600 mt-2">
              <Zap className="w-3 h-3 mr-1" />
              {stats.trendsData.scansThisWeek} Scans diese Woche
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Schnellaktionen</span>
            </CardTitle>
            <CardDescription>
              Die wichtigsten Aktionen für Ihre Accessibility-Optimierung
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Kritische Issues beheben</h4>
                    <p className="text-sm text-gray-600">{stats.criticalIssues} Issues benötigen sofortige Aufmerksamkeit</p>
                  </div>
                  <Button size="sm" variant="destructive">
                    Anzeigen
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Neuen Scan starten</h4>
                    <p className="text-sm text-gray-600">Überprüfen Sie Ihre Websites auf Updates</p>
                  </div>
                  <Button size="sm">
                    Scan starten
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">WCAG 2.2 Report</h4>
                    <p className="text-sm text-gray-600">Detaillierten Compliance-Report erstellen</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Erstellen
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Scans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Neueste Scans</span>
            </CardTitle>
            <CardDescription>
              Die zuletzt durchgeführten Accessibility-Scans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentScans.slice(0, 4).map((scan) => (
                <div 
                  key={scan.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onNavigateToScan(scan.id)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{scan.website?.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{scan.total_pages} Seiten</span>
                      <span>•</span>
                      <span>{new Date(scan.created_at).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={scan.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {scan.status}
                    </Badge>
                    {scan.total_issues > 0 && (
                      <Badge variant="destructive">
                        {scan.total_issues}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {recentScans.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Noch keine Scans durchgeführt</p>
                  <Button className="mt-2" size="sm">
                    Ersten Scan starten
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
