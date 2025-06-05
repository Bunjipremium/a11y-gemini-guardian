
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Globe, Plus, Settings, Activity, TrendingUp, Clock, ExternalLink, BarChart3, AlertTriangle } from 'lucide-react';

interface Website {
  id: string;
  name: string;
  base_url: string;
  created_at: string;
}

interface DashboardWebsitesProps {
  websites: Website[];
  stats: {
    totalWebsites: number;
    totalScans: number;
    totalIssues: number;
  };
  onNavigateToWebsite: (websiteId: string) => void;
}

const DashboardWebsites = ({ websites, stats, onNavigateToWebsite }: DashboardWebsitesProps) => {
  return (
    <div className="space-y-6">
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Verwaltete Websites</CardTitle>
            <Globe className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{stats.totalWebsites}</div>
            <p className="text-xs text-blue-600 mt-1">
              {stats.totalWebsites === 1 ? 'Website' : 'Websites'} aktiv überwacht
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Durchgeführte Scans</CardTitle>
            <Activity className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{stats.totalScans}</div>
            <p className="text-xs text-green-600 mt-1">
              Insgesamt abgeschlossen
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Gefundene Issues</CardTitle>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{stats.totalIssues}</div>
            <p className="text-xs text-red-600 mt-1">
              Accessibility-Probleme
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Durchschnitt</CardTitle>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">
              {stats.totalWebsites > 0 ? Math.round(stats.totalIssues / stats.totalWebsites) : 0}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Issues pro Website
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Websites Management Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-700" />
                <span>Website-Verwaltung</span>
              </CardTitle>
              <CardDescription className="mt-1">
                Verwalten und überwachen Sie Ihre Websites für Accessibility-Scans
              </CardDescription>
            </div>
            <Button 
              onClick={() => onNavigateToWebsite('')} 
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Website hinzufügen</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {websites.length > 0 ? (
            <div className="space-y-4">
              {websites.map((website) => (
                <Card key={website.id} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Globe className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-lg text-gray-900">{website.name}</h3>
                              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                                Aktiv
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <ExternalLink className="w-4 h-4" />
                              <a 
                                href={website.base_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                              >
                                {website.base_url}
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Hinzugefügt: {new Date(website.created_at).toLocaleDateString('de-DE')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="w-4 h-4" />
                            <span>Letzter Scan: Heute</span>
                          </div>
                        </div>
                        
                        {/* Compliance Score Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">WCAG 2.2 Compliance</span>
                            <span className="font-medium text-green-600">
                              {stats.totalIssues === 0 ? '100%' : '75%'}
                            </span>
                          </div>
                          <Progress 
                            value={stats.totalIssues === 0 ? 100 : 75} 
                            className="h-2"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onNavigateToWebsite(website.id)}
                          className="flex items-center space-x-2 w-full lg:w-auto"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Verwalten</span>
                        </Button>
                        <Button 
                          size="sm"
                          className="flex items-center space-x-2 w-full lg:w-auto bg-blue-600 hover:bg-blue-700"
                          onClick={() => {/* Navigate to new scan */}}
                        >
                          <Activity className="w-4 h-4" />
                          <span>Neuer Scan</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Noch keine Websites hinzugefügt
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Fügen Sie Ihre erste Website hinzu, um mit der professionellen 
                Accessibility-Überwachung zu beginnen.
              </p>
              <Button 
                onClick={() => onNavigateToWebsite('')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Erste Website hinzufügen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardWebsites;
