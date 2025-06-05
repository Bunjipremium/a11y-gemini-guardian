import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Table } from 'lucide-react';
import { exportToPDF, exportToExcel } from '@/services/exportService';
import ReportGenerator from './ReportGenerator';

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

interface ScanResult {
  id: string;
  url: string;
  title: string;
  status_code: number;
  load_time_ms: number;
  total_issues: number;
  critical_issues: number;
  serious_issues: number;
  moderate_issues: number;
  minor_issues: number;
}

interface AccessibilityIssue {
  id: string;
  rule_id: string;
  impact: string;
  description: string;
  help_text: string | null;
  help_url: string | null;
  target_element: string | null;
  html_snippet: string | null;
  ai_explanation: string | null;
  ai_fix_suggestion: string | null;
}

interface ExportActionsProps {
  scan: ScanData;
  scanResults: ScanResult[];
  selectedResult?: ScanResult | null;
  issues?: AccessibilityIssue[];
}

const ExportActions = ({ scan, scanResults, selectedResult, issues = [] }: ExportActionsProps) => {
  const handlePDFExport = () => {
    exportToPDF(scan, scanResults, issues);
  };

  const handleExcelExport = () => {
    exportToExcel(scan, scanResults, issues);
  };

  return (
    <div className="space-y-6">
      {/* Traditional Export Options */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Standard Export</span>
          </CardTitle>
          <CardDescription>
            Export your scan results in traditional formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePDFExport}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </Button>
            
            <Button
              onClick={handleExcelExport}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Table className="w-4 h-4" />
              <span>Export Excel</span>
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-gray-600">
            {selectedResult && issues.length > 0 
              ? `Export includes detailed issues for ${selectedResult.url}`
              : 'Export includes scan overview and page results'
            }
          </div>
        </CardContent>
      </Card>

      {/* AI-Generated Expert Report */}
      <ReportGenerator scan={scan} />
    </div>
  );
};

export default ExportActions;
