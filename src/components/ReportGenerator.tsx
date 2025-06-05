
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Loader2, 
  Download, 
  CheckCircle,
  Sparkles,
  Eye,
  Building,
  Users,
  AlertTriangle
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScanData {
  id: string;
  status: string;
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

interface ReportGeneratorProps {
  scan: ScanData;
}

interface GeneratedReport {
  report: string;
  metadata: {
    generatedAt: string;
    reportType: string;
    language: string;
    scanId: string;
    websiteName: string;
  };
}

const ReportGenerator = ({ scan }: ReportGeneratorProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'executive'>('detailed');
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const generateReport = async () => {
    setGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-wcag-report', {
        body: { 
          scanId: scan.id,
          reportType,
          language
        }
      });

      if (error) throw error;

      setGeneratedReport(data);
      setShowPreview(true);
      
      toast({
        title: 'WCAG 2.2 Report erstellt',
        description: 'Der expertenhaft formulierte Report wurde erfolgreich generiert.',
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Fehler bei Report-Generierung',
        description: 'Der Report konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!generatedReport) return;

    const element = document.createElement('a');
    const file = new Blob([generatedReport.report], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `WCAG-Report-${generatedReport.metadata.websiteName}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = async () => {
    if (!generatedReport) return;
    
    try {
      await navigator.clipboard.writeText(generatedReport.report);
      toast({
        title: 'Report kopiert',
        description: 'Der Report wurde in die Zwischenablage kopiert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler beim Kopieren',
        description: 'Der Report konnte nicht kopiert werden.',
        variant: 'destructive'
      });
    }
  };

  const getReportTypeInfo = (type: string) => {
    const types = {
      summary: {
        title: 'Summary Report',
        description: 'Übersichtlicher Report für Projektmanager und Entwicklungsteams',
        icon: <Eye className="w-4 h-4" />,
        badge: 'Kompakt'
      },
      detailed: {
        title: 'Detailed Expert Report',
        description: 'Umfassender Experten-Report mit allen technischen Details',
        icon: <FileText className="w-4 h-4" />,
        badge: 'Vollständig'
      },
      executive: {
        title: 'Executive Summary',
        description: 'Strategischer Report für die Geschäftsführung und C-Level',
        icon: <Building className="w-4 h-4" />,
        badge: 'Business'
      }
    };
    return types[type as keyof typeof types];
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>WCAG 2.2 Expert Report Generator</span>
          </CardTitle>
          <CardDescription>
            Generieren Sie professionelle, expertenhaft formulierte WCAG 2.2 Compliance-Reports mit KI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Report Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['summary', 'detailed', 'executive'] as const).map((type) => {
              const info = getReportTypeInfo(type);
              return (
                <Card 
                  key={type}
                  className={`cursor-pointer transition-all ${
                    reportType === type 
                      ? 'ring-2 ring-purple-500 bg-purple-100' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setReportType(type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {info.icon}
                        <span className="font-medium">{info.title}</span>
                      </div>
                      <Badge variant="outline">{info.badge}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Language Selection */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Sprache:</label>
            <Select value={language} onValueChange={(value: 'de' | 'en') => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generation Button */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              Report für: <span className="font-medium">{scan.website.name}</span>
            </div>
            <Button
              onClick={generateReport}
              disabled={generating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {generating ? 'Generiere Report...' : 'Expert Report erstellen'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Report Preview */}
      {generatedReport && showPreview && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Generierter WCAG 2.2 Expert Report</span>
                </CardTitle>
                <CardDescription>
                  Erstellt am {new Date(generatedReport.metadata.generatedAt).toLocaleString('de-DE')}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {getReportTypeInfo(generatedReport.metadata.reportType).title}
                </Badge>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  Kopieren
                </Button>
                <Button variant="outline" size="sm" onClick={downloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {generatedReport.report}
              </pre>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <span>
                Report-Länge: {generatedReport.report.length.toLocaleString()} Zeichen
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                Vorschau schließen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Expert Report Features</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Summary Report:</strong> Kompakter Überblick für Teams (2-3 Seiten)</li>
                <li>• <strong>Detailed Report:</strong> Vollständiger Experten-Audit mit technischen Details (8-12 Seiten)</li>
                <li>• <strong>Executive Summary:</strong> Strategischer Business-fokussierter Report für C-Level (3-4 Seiten)</li>
                <li>• Alle Reports folgen WCAG 2.2 Standards und sind expertenhaft formuliert</li>
                <li>• Automatische Priorisierung und Handlungsempfehlungen</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
