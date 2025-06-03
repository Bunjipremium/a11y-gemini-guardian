
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Eye,
  TrendingUp,
  Activity
} from 'lucide-react';

interface ScanProgressProps {
  scanId: string;
  onScanComplete?: () => void;
}

interface ScanStatus {
  id: string;
  status: string;
  total_pages: number;
  scanned_pages: number;
  total_issues: number;
  started_at: string;
  completed_at: string | null;
  website: {
    name: string;
    base_url: string;
  };
}

const ScanProgress = ({ scanId, onScanComplete }: ScanProgressProps) => {
  const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [scanSpeed, setScanSpeed] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScanStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('scans')
          .select(`
            *,
            website:websites(name, base_url)
          `)
          .eq('id', scanId)
          .single();

        if (error) throw error;
        setScanStatus(data);
      } catch (error) {
        console.error('Error fetching scan status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScanStatus();

    // Set up real-time subscription for scan updates
    const scanChannel = supabase
      .channel(`scan-${scanId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scans',
          filter: `id=eq.${scanId}`
        },
        (payload) => {
          console.log('Scan update received:', payload);
          setScanStatus(prev => prev ? { ...prev, ...payload.new } : null);
          
          if (payload.new.status === 'completed') {
            onScanComplete?.();
          }
        }
      )
      .subscribe();

    // Set up subscription for scan results to track current URL
    const resultsChannel = supabase
      .channel(`scan-results-${scanId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scan_results',
          filter: `scan_id=eq.${scanId}`
        },
        (payload) => {
          console.log('New scan result:', payload);
          setCurrentUrl(payload.new.url);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(scanChannel);
      supabase.removeChannel(resultsChannel);
    };
  }, [scanId, onScanComplete]);

  useEffect(() => {
    if (scanStatus && scanStatus.status === 'running') {
      const startTime = new Date(scanStatus.started_at).getTime();
      const now = Date.now();
      const elapsed = (now - startTime) / 1000; // seconds
      
      if (scanStatus.scanned_pages > 0) {
        const pagesPerSecond = scanStatus.scanned_pages / elapsed;
        setScanSpeed(pagesPerSecond);
        
        const remainingPages = scanStatus.total_pages - scanStatus.scanned_pages;
        if (pagesPerSecond > 0) {
          setEstimatedTimeRemaining(remainingPages / pagesPerSecond);
        }
      }
    }
  }, [scanStatus]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!scanStatus) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Scan nicht gefunden</p>
        </CardContent>
      </Card>
    );
  }

  const progress = scanStatus.total_pages > 0 
    ? (scanStatus.scanned_pages / scanStatus.total_pages) * 100 
    : 0;

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
      case 'running': return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <div className={getStatusColor(scanStatus.status)}>
                  {getStatusIcon(scanStatus.status)}
                </div>
                <span>Accessibility-Scan</span>
              </CardTitle>
              <CardDescription>
                {scanStatus.website.name} • {scanStatus.website.base_url}
              </CardDescription>
            </div>
            <Badge variant={scanStatus.status === 'completed' ? 'default' : 'secondary'}>
              {scanStatus.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fortschritt</span>
              <span>{scanStatus.scanned_pages} von {scanStatus.total_pages} Seiten</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-center text-sm text-gray-600">
              {Math.round(progress)}% abgeschlossen
            </div>
          </div>

          {/* Current URL being scanned */}
          {scanStatus.status === 'running' && currentUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Aktuell wird gescannt:</span>
              </div>
              <p className="text-sm text-blue-700 break-all">{currentUrl}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Globe className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-gray-900">{scanStatus.scanned_pages}</div>
              <div className="text-xs text-gray-600">Seiten gescannt</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-orange-600">{scanStatus.total_issues}</div>
              <div className="text-xs text-gray-600">Issues gefunden</div>
            </div>

            {scanStatus.status === 'running' && scanSpeed > 0 && (
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-blue-600">
                  {scanSpeed.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Seiten/s</div>
              </div>
            )}

            {scanStatus.status === 'running' && estimatedTimeRemaining && (
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-green-600">
                  {formatTime(estimatedTimeRemaining)}
                </div>
                <div className="text-xs text-gray-600">verbleibt ca.</div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Gestartet:</span>
              <span>{new Date(scanStatus.started_at).toLocaleString('de-DE')}</span>
            </div>
            {scanStatus.completed_at && (
              <div className="flex justify-between text-sm">
                <span>Abgeschlossen:</span>
                <span>{new Date(scanStatus.completed_at).toLocaleString('de-DE')}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {scanStatus.status === 'completed' && (
            <div className="flex space-x-2 pt-4">
              <Button onClick={() => window.location.reload()}>
                Ergebnisse aktualisieren
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      {scanStatus.status === 'running' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Live-Aktivität</CardTitle>
            <CardDescription>
              Echtzeitübersicht der Scan-Aktivitäten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-800">
                    Crawling läuft...
                  </div>
                  <div className="text-xs text-blue-600">
                    Analysiere Webseiten auf Accessibility-Probleme
                  </div>
                </div>
                <div className="text-xs text-blue-600">
                  {scanSpeed > 0 && `${scanSpeed.toFixed(1)} Seiten/s`}
                </div>
              </div>
              
              {currentUrl && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">
                      Aktuelle Seite
                    </div>
                    <div className="text-xs text-gray-600 break-all">
                      {currentUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScanProgress;
