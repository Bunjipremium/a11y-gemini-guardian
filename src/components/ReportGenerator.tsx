
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
import { ScanData } from '@/types/scan';
import jsPDF from 'jspdf';

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
        title: language === 'de' ? 'WCAG 2.2 Report erstellt' : 'WCAG 2.2 Report generated',
        description: language === 'de' ? 'Der expertenhaft formulierte Report wurde erfolgreich generiert.' : 'The expert report has been successfully generated.',
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: language === 'de' ? 'Fehler bei Report-Generierung' : 'Error generating report',
        description: language === 'de' ? 'Der Report konnte nicht erstellt werden. Bitte versuchen Sie es erneut.' : 'The report could not be generated. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadReportAsText = () => {
    if (!generatedReport) return;

    const element = document.createElement('a');
    const file = new Blob([generatedReport.report], { type: 'text/plain; charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `WCAG-Report-${generatedReport.metadata.websiteName}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadReportAsPDF = () => {
    if (!generatedReport) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, maxWidth: number, fontSize = 10) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
      yPosition += 5;
    };

    // Title
    doc.setFontSize(20);
    const titleText = language === 'de' ? 'WCAG 2.2 Expert Report' : 'WCAG 2.2 Expert Report';
    doc.text(titleText, margin, yPosition);
    yPosition += 15;

    // Report metadata
    doc.setFontSize(12);
    doc.text(`Website: ${generatedReport.metadata.websiteName}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Report Type: ${getReportTypeInfo(generatedReport.metadata.reportType).title}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Language: ${generatedReport.metadata.language.toUpperCase()}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Generated: ${new Date(generatedReport.metadata.generatedAt).toLocaleString(language === 'de' ? 'de-DE' : 'en-US')}`, margin, yPosition);
    yPosition += 15;

    // Report content
    addWrappedText(generatedReport.report, pageWidth - 2 * margin, 10);

    // Save the PDF
    const fileName = `WCAG-Report-${generatedReport.metadata.websiteName}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    toast({
      title: language === 'de' ? 'PDF erstellt' : 'PDF created',
      description: language === 'de' ? 'Der Report wurde als PDF heruntergeladen.' : 'The report has been downloaded as PDF.',
    });
  };

  const copyToClipboard = async () => {
    if (!generatedReport) return;
    
    try {
      await navigator.clipboard.writeText(generatedReport.report);
      toast({
        title: language === 'de' ? 'Report kopiert' : 'Report copied',
        description: language === 'de' ? 'Der Report wurde in die Zwischenablage kopiert.' : 'The report has been copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: language === 'de' ? 'Fehler beim Kopieren' : 'Copy error',
        description: language === 'de' ? 'Der Report konnte nicht kopiert werden.' : 'The report could not be copied.',
        variant: 'destructive'
      });
    }
  };

  const getReportTypeInfo = (type: string) => {
    const types = {
      summary: {
        title: language === 'de' ? 'Summary Report' : 'Summary Report',
        description: language === 'de' ? 'Übersichtlicher Report für Projektmanager und Entwicklungsteams' : 'Clear report for project managers and development teams',
        icon: <Eye className="w-4 h-4" />,
        badge: language === 'de' ? 'Kompakt' : 'Compact'
      },
      detailed: {
        title: language === 'de' ? 'Detailed Expert Report' : 'Detailed Expert Report',
        description: language === 'de' ? 'Umfassender Experten-Report mit allen technischen Details' : 'Comprehensive expert report with all technical details',
        icon: <FileText className="w-4 h-4" />,
        badge: language === 'de' ? 'Vollständig' : 'Complete'
      },
      executive: {
        title: language === 'de' ? 'Executive Summary' : 'Executive Summary',
        description: language === 'de' ? 'Strategischer Report für die Geschäftsführung und C-Level' : 'Strategic report for management and C-Level',
        icon: <Building className="w-4 h-4" />,
        badge: 'Business'
      }
    };
    return types[type as keyof typeof types];
  };

  // Guard against missing website data
  if (!scan.website) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-medium text-red-900">
                {language === 'de' ? 'Website-Daten fehlen' : 'Website data missing'}
              </h4>
              <p className="text-sm text-red-800">
                {language === 'de' 
                  ? 'Der Report kann nicht generiert werden, da die Website-Informationen fehlen.'
                  : 'The report cannot be generated because website information is missing.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>
              {language === 'de' ? 'WCAG 2.2 Expert Report Generator' : 'WCAG 2.2 Expert Report Generator'}
            </span>
          </CardTitle>
          <CardDescription>
            {language === 'de' 
              ? 'Generieren Sie professionelle, expertenhaft formulierte WCAG 2.2 Compliance-Reports mit KI'
              : 'Generate professional, expertly crafted WCAG 2.2 compliance reports with AI'
            }
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
            <label className="text-sm font-medium">
              {language === 'de' ? 'Sprache:' : 'Language:'}
            </label>
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
              {language === 'de' ? 'Report für:' : 'Report for:'} <span className="font-medium">{scan.website.name}</span>
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
              {generating 
                ? (language === 'de' ? 'Generiere Report...' : 'Generating report...')
                : (language === 'de' ? 'Expert Report erstellen' : 'Create expert report')
              }
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
                  <span>
                    {language === 'de' ? 'Generierter WCAG 2.2 Expert Report' : 'Generated WCAG 2.2 Expert Report'}
                  </span>
                </CardTitle>
                <CardDescription>
                  {language === 'de' ? 'Erstellt am' : 'Created on'} {new Date(generatedReport.metadata.generatedAt).toLocaleString(language === 'de' ? 'de-DE' : 'en-US')}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {getReportTypeInfo(generatedReport.metadata.reportType).title}
                </Badge>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {language === 'de' ? 'Kopieren' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadReportAsPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={downloadReportAsText}>
                  <FileText className="w-4 h-4 mr-2" />
                  TXT
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
                {language === 'de' ? 'Report-Länge:' : 'Report length:'} {generatedReport.report.length.toLocaleString()} {language === 'de' ? 'Zeichen' : 'characters'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                {language === 'de' ? 'Vorschau schließen' : 'Close preview'}
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
              <h4 className="font-medium text-blue-900 mb-1">
                {language === 'de' ? 'Expert Report Features' : 'Expert Report Features'}
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {language === 'de' ? (
                  <>
                    <li>• <strong>Summary Report:</strong> Kompakter Überblick für Teams (2-3 Seiten)</li>
                    <li>• <strong>Detailed Report:</strong> Vollständiger Experten-Audit mit technischen Details (8-12 Seiten)</li>
                    <li>• <strong>Executive Summary:</strong> Strategischer Business-fokussierter Report für C-Level (3-4 Seiten)</li>
                    <li>• Alle Reports folgen WCAG 2.2 Standards und sind expertenhaft formuliert</li>
                    <li>• Automatische Priorisierung und Handlungsempfehlungen</li>
                    <li>• Download als PDF oder TXT verfügbar</li>
                  </>
                ) : (
                  <>
                    <li>• <strong>Summary Report:</strong> Compact overview for teams (2-3 pages)</li>
                    <li>• <strong>Detailed Report:</strong> Complete expert audit with technical details (8-12 pages)</li>
                    <li>• <strong>Executive Summary:</strong> Strategic business-focused report for C-Level (3-4 pages)</li>
                    <li>• All reports follow WCAG 2.2 standards and are expertly crafted</li>
                    <li>• Automatic prioritization and action recommendations</li>
                    <li>• Download as PDF or TXT available</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
