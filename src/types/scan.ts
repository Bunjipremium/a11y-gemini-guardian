
export interface Website {
  name: string;
  base_url: string;
}

export interface ScanData {
  id: string;
  website_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  total_pages: number;
  scanned_pages: number;
  total_issues: number;
  created_at: string;
  website?: Website;
}

export interface ScanResult {
  id: string;
  scan_id: string;
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

export interface AccessibilityIssue {
  id: string;
  scan_result_id: string;
  rule_id: string;
  impact: string;
  description: string;
  help_text: string | null;
  help_url: string | null;
  target_element: string | null;
  html_snippet: string | null;
  ai_explanation: string | null;
  ai_fix_suggestion: string | null;
  wcag_level?: string;
  wcag_principle?: string;
  wcag_guideline?: string;
  wcag_reference?: string;
}
