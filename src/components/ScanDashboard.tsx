
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Eye, BookOpen } from 'lucide-react';
import WcagComplianceCard from './WcagComplianceCard';

interface ScanDashboardProps {
  scan: {
    id: string;
    status: string;
    total_pages: number;
    scanned_pages: number;
    total_issues: number;
    website: {
      name: string;
    };
  };
  scanResults: Array<{
    id: string;
    url: string;
    total_issues: number;
    critical_issues: number;
    serious_issues: number;
    moderate_issues: number;
    minor_issues: number;
  }>;
  allIssues?: Array<{
    wcag_level?: string;
    wcag_principle?: string;
    impact: string;
  }>;
}

const ScanDashboard = ({ scan, scanResults, allIssues = [] }: ScanDashboardProps) => {
  // Calculate statistics
  const totalIssues = scanResults.reduce((sum, result) => sum + result.total_issues, 0);
  const criticalIssues = scanResults.reduce((sum, result) => sum + result.critical_issues, 0);
  const seriousIssues = scanResults.reduce((sum, result) => sum + result.serious_issues, 0);
  const moderateIssues = scanResults.reduce((sum, result) => sum + result.moderate_issues, 0);
  const minorIssues = scanResults.reduce((sum, result) => sum + result.minor_issues, 0);

  // Issues by severity for pie chart
  const severityData = [
    { name: 'Kritisch', value: criticalIssues, color: '#dc2626' },
    { name: 'Schwerwiegend', value: seriousIssues, color: '#ea580c' },
    { name: 'Mäßig', value: moderateIssues, color: '#ca8a04' },
    { name: 'Gering', value: minorIssues, color: '#65a30d' }
  ].filter(item => item.value > 0);

  // Top problematic pages
  const topProblematicPages = scanResults
    .filter(result => result.total_issues > 0)
    .sort((a, b) => b.total_issues - a.total_issues)
    .slice(0, 5)
    .map(result => ({
      url: result.url.length > 30 ? result.url.substring(0, 30) + '...' : result.url,
      fullUrl: result.url,
      issues: result.total_issues
    }));

  const chartConfig = {
    issues: {
      label: "Issues"
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'running': return <Clock className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <div className={getStatusColor(scan.status)}>
              {getStatusIcon(scan.status)}
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={scan.status === 'completed' ? 'default' : 'secondary'}>
              {scan.status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {scan.scanned_pages} von {scan.total_pages} Seiten
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Issues</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalIssues}</div>
            <p className="text-xs text-muted-foreground">
              Accessibility-Probleme gefunden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kritische Issues</CardTitle>
            <TrendingUp className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
            <p className="text-xs text-muted-foreground">
              Sofortige Aufmerksamkeit erforderlich
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschnitt pro Seite</CardTitle>
            <Eye className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {scan.scanned_pages > 0 ? Math.round(totalIssues / scan.scanned_pages) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Issues pro Seite
            </p>
          </CardContent>
        </Card>
      </div>

      {/* WCAG 2.2 Compliance Cards */}
      {allIssues.length > 0 && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>WCAG 2.2 Compliance Analyse</span>
            </h3>
            <p className="text-sm text-gray-600">
              Detaillierte Auswertung der Barrierefreiheit nach WCAG 2.2 Standards
            </p>
          </div>
          <WcagComplianceCard 
            issues={allIssues} 
            totalPages={scan.scanned_pages} 
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Severity */}
        <Card>
          <CardHeader>
            <CardTitle>Issues nach Schweregrad</CardTitle>
            <CardDescription>
              Verteilung der gefundenen Accessibility-Probleme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {severityData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Keine Issues gefunden
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Problematic Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Problematischste Seiten</CardTitle>
            <CardDescription>
              Seiten mit den meisten Accessibility-Problemen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topProblematicPages.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={topProblematicPages}>
                  <XAxis 
                    dataKey="url" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Bar dataKey="issues" fill="#f59e0b" />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value, payload) => {
                      const item = topProblematicPages.find(page => page.url === value);
                      return item ? item.fullUrl : value;
                    }}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Keine problematischen Seiten gefunden
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanDashboard;
