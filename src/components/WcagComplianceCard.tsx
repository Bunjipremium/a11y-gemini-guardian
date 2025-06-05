
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';

interface AccessibilityIssue {
  wcag_level?: string;
  wcag_principle?: string;
  impact: string;
}

interface WcagComplianceProps {
  issues: AccessibilityIssue[];
  totalPages: number;
}

const WcagComplianceCard = ({ issues, totalPages }: WcagComplianceProps) => {
  // Calculate WCAG Level compliance
  const wcagLevelData = issues.reduce((acc, issue) => {
    if (issue.wcag_level) {
      acc[issue.wcag_level] = (acc[issue.wcag_level] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calculate WCAG Principle compliance
  const principleData = issues.reduce((acc, issue) => {
    if (issue.wcag_principle) {
      acc[issue.wcag_principle] = (acc[issue.wcag_principle] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // WCAG Level chart data
  const levelChartData = Object.entries(wcagLevelData).map(([level, count]) => ({
    name: `WCAG ${level}`,
    value: count,
    color: level === 'A' ? '#10b981' : level === 'AA' ? '#3b82f6' : '#8b5cf6'
  }));

  // WCAG Principle chart data
  const principleChartData = Object.entries(principleData).map(([principle, count]) => ({
    name: principle,
    value: count,
    icon: principle === 'Wahrnehmbar' ? '👁️' : 
          principle === 'Bedienbar' ? '🖱️' : 
          principle === 'Verständlich' ? '🧠' : '🔧'
  }));

  // Calculate compliance percentage (pages without critical/serious issues)
  const criticalIssues = issues.filter(issue => 
    issue.impact === 'critical' || issue.impact === 'serious'
  ).length;
  
  const compliancePercentage = totalPages > 0 
    ? Math.max(0, Math.round(((totalPages * 10 - criticalIssues) / (totalPages * 10)) * 100))
    : 0;

  const chartConfig = {
    value: { label: "Issues" }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* WCAG Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>WCAG 2.2 Compliance</span>
          </CardTitle>
          <CardDescription>
            Geschätzte Compliance basierend auf gefundenen Issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Compliance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Geschätzte Compliance</span>
              <span className="text-2xl font-bold text-green-600">{compliancePercentage}%</span>
            </div>
            <Progress value={compliancePercentage} className="h-3" />
            <p className="text-xs text-gray-500">
              Basierend auf kritischen und schwerwiegenden Issues
            </p>
          </div>

          {/* WCAG Level Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>WCAG Level Breakdown</span>
            </h4>
            
            {Object.entries(wcagLevelData).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <Badge className={
                    level === 'A' ? 'bg-green-100 text-green-800' :
                    level === 'AA' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }>
                    WCAG {level}
                  </Badge>
                  <span className="text-sm">
                    {level === 'A' ? 'Grundlegende Zugänglichkeit' :
                     level === 'AA' ? 'Standard Compliance' :
                     'Erweiterte Zugänglichkeit'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{count} Issues</span>
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                </div>
              </div>
            ))}

            {Object.keys(wcagLevelData).length === 0 && (
              <div className="text-center py-4 text-green-600">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Keine WCAG-Issues gefunden!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* WCAG Principles Chart */}
      <Card>
        <CardHeader>
          <CardTitle>WCAG Prinzipien</CardTitle>
          <CardDescription>
            Verteilung der Issues nach WCAG-Prinzipien
          </CardDescription>
        </CardHeader>
        <CardContent>
          {principleChartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={principleChartData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const item = principleChartData.find(p => p.name === value);
                    return item ? `${item.icon} ${value}` : value;
                  }}
                />
                <YAxis />
                <Bar dataKey="value" fill="#f59e0b" />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => {
                    const item = principleChartData.find(p => p.name === value);
                    return item ? `${item.icon} ${value}` : value;
                  }}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p>Keine Prinzip-Issues gefunden</p>
              </div>
            </div>
          )}
          
          {/* Principle Legend */}
          {principleChartData.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {[
                { name: 'Wahrnehmbar', icon: '👁️', desc: 'Sichtbar & hörbar' },
                { name: 'Bedienbar', icon: '🖱️', desc: 'Funktional nutzbar' },
                { name: 'Verständlich', icon: '🧠', desc: 'Klar & verständlich' },
                { name: 'Robust', icon: '🔧', desc: 'Technisch kompatibel' }
              ].map(principle => (
                <div key={principle.name} className="flex items-center space-x-1 p-1">
                  <span>{principle.icon}</span>
                  <div>
                    <div className="font-medium">{principle.name}</div>
                    <div className="text-gray-500">{principle.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WcagComplianceCard;
