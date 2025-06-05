
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Plus, Settings, Activity, TrendingUp, Clock } from 'lucide-react';

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
      {/* Websites Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verwaltete Websites</CardTitle>
            <Globe className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalWebsites}</div>
            <p className="text-xs text-muted-foreground">
              Aktiv überwacht
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchgeführte Scans</CardTitle>
            <Activity className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.totalScans}</div>
            <p className="text-xs text-muted-foreground">
              Insgesamt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschnitt pro Website</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalWebsites > 0 ? Math.round(stats.totalScans / stats.totalWebsites) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Scans pro Website
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Websites List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ihre Websites</CardTitle>
            <CardDescription>
              Verwalten und überwachen Sie Ihre Websites
            </CardDescription>
          </div>
          <Button onClick={() => onNavigateToWebsite('')} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Website hinzufügen</span>
          </Button>
        </CardHeader>
        <CardContent>
          {websites.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {websites.map((website) => (
                <Card key={website.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <h3 className="font-semibold">{website.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{website.base_url}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Hinzugefügt: {new Date(website.created_at).toLocaleDateString('de-DE')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge variant="outline">Aktiv</Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onNavigateToWebsite(website.id)}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Verwalten
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Noch keine Websites hinzugefügt</h3>
              <p className="text-gray-600 mb-4">
                Fügen Sie Ihre erste Website hinzu, um mit der Accessibility-Überwachung zu beginnen.
              </p>
              <Button onClick={() => onNavigateToWebsite('')}>
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
