
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

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

export const exportToPDF = (
  scan: ScanData,
  scanResults: ScanResult[],
  issues: AccessibilityIssue[] = []
) => {
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
  doc.text('Accessibility Scan Report', margin, yPosition);
  yPosition += 15;

  // Scan Overview
  doc.setFontSize(16);
  doc.text('Scan Overview', margin, yPosition);
  yPosition += 10;

  addWrappedText(`Website: ${scan.website.name}`, pageWidth - 2 * margin, 12);
  addWrappedText(`URL: ${scan.website.base_url}`, pageWidth - 2 * margin, 12);
  addWrappedText(`Status: ${scan.status}`, pageWidth - 2 * margin, 12);
  addWrappedText(`Total Pages: ${scan.scanned_pages}/${scan.total_pages}`, pageWidth - 2 * margin, 12);
  addWrappedText(`Total Issues: ${scan.total_issues}`, pageWidth - 2 * margin, 12);
  
  if (scan.started_at) {
    addWrappedText(`Started: ${new Date(scan.started_at).toLocaleString()}`, pageWidth - 2 * margin, 12);
  }
  
  if (scan.completed_at) {
    addWrappedText(`Completed: ${new Date(scan.completed_at).toLocaleString()}`, pageWidth - 2 * margin, 12);
  }

  yPosition += 10;

  // Page Results Summary
  if (scanResults.length > 0) {
    doc.setFontSize(16);
    doc.text('Page Results Summary', margin, yPosition);
    yPosition += 10;

    scanResults.forEach((result, index) => {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(12);
      doc.text(`${index + 1}. ${result.title || 'Untitled'}`, margin, yPosition);
      yPosition += 8;
      
      addWrappedText(`URL: ${result.url}`, pageWidth - 2 * margin, 10);
      addWrappedText(`Status: ${result.status_code} | Load Time: ${result.load_time_ms}ms`, pageWidth - 2 * margin, 10);
      addWrappedText(`Issues: ${result.total_issues} (Critical: ${result.critical_issues}, Serious: ${result.serious_issues})`, pageWidth - 2 * margin, 10);
      
      yPosition += 5;
    });
  }

  // Issues Details (if provided)
  if (issues.length > 0) {
    doc.addPage();
    yPosition = margin;
    
    doc.setFontSize(16);
    doc.text('Detailed Issues', margin, yPosition);
    yPosition += 10;

    issues.forEach((issue, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(12);
      doc.text(`${index + 1}. ${issue.rule_id} (${issue.impact})`, margin, yPosition);
      yPosition += 8;
      
      addWrappedText(`Description: ${issue.description}`, pageWidth - 2 * margin, 10);
      
      if (issue.ai_explanation) {
        addWrappedText(`AI Explanation: ${issue.ai_explanation}`, pageWidth - 2 * margin, 10);
      }
      
      if (issue.ai_fix_suggestion) {
        addWrappedText(`AI Fix Suggestion: ${issue.ai_fix_suggestion}`, pageWidth - 2 * margin, 10);
      }
      
      yPosition += 5;
    });
  }

  // Save the PDF
  const fileName = `accessibility-report-${scan.website.name}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const exportToExcel = (
  scan: ScanData,
  scanResults: ScanResult[],
  issues: AccessibilityIssue[] = []
) => {
  const workbook = XLSX.utils.book_new();

  // Scan Overview Sheet
  const overviewData = [
    ['Website', scan.website.name],
    ['Base URL', scan.website.base_url],
    ['Status', scan.status],
    ['Total Pages', `${scan.scanned_pages}/${scan.total_pages}`],
    ['Total Issues', scan.total_issues],
    ['Started At', scan.started_at ? new Date(scan.started_at).toLocaleString() : ''],
    ['Completed At', scan.completed_at ? new Date(scan.completed_at).toLocaleString() : ''],
  ];
  
  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Scan Overview');

  // Page Results Sheet
  if (scanResults.length > 0) {
    const pageResultsData = [
      ['URL', 'Title', 'Status Code', 'Load Time (ms)', 'Total Issues', 'Critical', 'Serious', 'Moderate', 'Minor']
    ];
    
    scanResults.forEach(result => {
      pageResultsData.push([
        result.url,
        result.title || '',
        result.status_code,
        result.load_time_ms,
        result.total_issues,
        result.critical_issues,
        result.serious_issues,
        result.moderate_issues,
        result.minor_issues
      ]);
    });
    
    const pageResultsSheet = XLSX.utils.aoa_to_sheet(pageResultsData);
    XLSX.utils.book_append_sheet(workbook, pageResultsSheet, 'Page Results');
  }

  // Issues Sheet
  if (issues.length > 0) {
    const issuesData = [
      ['Rule ID', 'Impact', 'Description', 'Help Text', 'Help URL', 'Target Element', 'AI Explanation', 'AI Fix Suggestion']
    ];
    
    issues.forEach(issue => {
      issuesData.push([
        issue.rule_id,
        issue.impact,
        issue.description,
        issue.help_text || '',
        issue.help_url || '',
        issue.target_element || '',
        issue.ai_explanation || '',
        issue.ai_fix_suggestion || ''
      ]);
    });
    
    const issuesSheet = XLSX.utils.aoa_to_sheet(issuesData);
    XLSX.utils.book_append_sheet(workbook, issuesSheet, 'Issues');
  }

  // Save the Excel file
  const fileName = `accessibility-report-${scan.website.name}-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
