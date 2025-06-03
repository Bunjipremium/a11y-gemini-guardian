
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
  Activity,
  Search,
  Code,
  Shield
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
  const [currentActivity, setCurrentActivity] = useState<string>('Scan wird vorbereitet...');
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [scanSpeed, setScanSpeed] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Activity messages for different scan phases
  const activities = [
    { phase: 'discovering', message: 'Durchsuche Website nach URLs...', icon: Search },
    { phase: 'crawling', message: 'Analysiere Seiteninhalte...', icon: Eye },
    { phase: 'analyzing', message: 'Prüfe Accessibility-Standards...', icon: Code },
    { phase: 'checking', message: 'Identifiziere Barrierefreiheit-Issues...', icon: Shield },
    { phase: 'finalizing', message: 'Erstelle Analysebericht...', icon: CheckCircle }
  ];

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
        console.log('Initial scan status:', data);
      } catch (error) {
        console.error('Error fetching scan status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScanStatus();

    // Set up real-time subscription for scan updates with proper channel name
    const channel = supabase
      .channel(`scan_updates_${scanId}`)
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
          setScanStatus(prev => {
            if (prev) {
              const updated = { ...prev, ...payload.new };
              console.log('Updated scan status:', updated);
              return updated;
            }
            return null;
          });
          
          if (payload.new.status === 'completed') {
            setCurrentActivity('Scan abgeschlossen!');
            setTimeout(() => {
              onScanComplete?.();
            }, 2000);
          }
        }
      )
      .subscribe((status) => {
        console.log('Scan channel subscription status:', status);
      });

    // Set up subscription for scan results to track current URL
    const resultsChannel = supabase
      .channel(`scan_results_${scanId}`)
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
          if (payload.new.url) {
            setCurrentUrl(payload.new.url);
            setCurrentActivity('Analysiere Seiteninhalte...');
          }
        }
      )
      .subscribe((status) => {
        console.log('Results channel subscription status:', status);
      });

    // Fallback: Poll for updates every 2 seconds
    const pollInterval = setInterval(async () => {
      if (scanStatus?.status === 'running' || scanStatus?.status === 'pending') {
        try {
          const { data, error } = await supabase
            .from('scans')
            .select(`
              *,
              website:websites(name, base_url)
            `)
            .eq('id', scanId)
            .single();

          if (!error && data) {
            setScanStatus(prev => {
              if (prev && (
                prev.status !== data.status ||
                prev.scanned_pages !== data.scanned_pages ||
                prev.total_pages !== data.total_pages ||
                prev.total_issues !== data.total_issues
              )) {
                console.log('Poll update - scan status changed:', data);
                return data;
              }
              return prev;
            });
          }
        } catch (error) {
          console.error('Error polling scan status:', error);
        }
      }
    }, 2000);

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(resultsChannel);
      clearInterval(pollInterval);
    };
  }, [scanId, onScanComplete, scanStatus?.status]);

  // Update elapsed time and estimates
  useEffect(() => {
    if (scanStatus && scanStatus.status === 'running' && scanStatus.started_at) {
      const interval = setInterval(() => {
        const startTime = new Date(scanStatus.started_at).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
        
        if (scanStatus.scanned_pages > 0 && elapsed > 0) {
          const pagesPerSecond = scanStatus.scanned_pages / elapsed;
          setScanSpeed(pagesPerSecond);
          
          const remainingPages = Math.max(0, scanStatus.total_pages - scanStatus.scanned_pages);
          if (pagesPerSecond > 0 && remainingPages > 0) {
            setEstimatedTimeRemaining(remainingPages / pagesPerSecond);
          } else {
            setEstimatedTimeRemaining(null);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [scanStatus]);

  // Update activity based on progress
  useEffect(() => {
    if (scanStatus) {
      if (scanStatus.status === 'pending') {
        setCurrentActivity('Scan wird vorbereitet...');
      } else if (scanStatus.status === 'running') {
        const progress = scanStatus.total_pages > 0 
          ? (scanStatus.scanned_pages / scanStatus.total_pages) * 100 
          : 0;

        if (scanStatus.total_pages === 0) {
          setCurrentActivity('Durchsuche Website nach URLs...');
        } else if (progress < 25) {
          setCurrentActivity('Analysiere Seiteninhalte...');
        } else if (progress < 75) {
          setCurrentActivity('Prüfe Accessibility-Standards...');
        } else if (progress < 95) {
          setCurrentActivity('Identifiziere Barrierefreiheit-Issues...');
        } else {
          setCurrentActivity('Erstelle Analysebericht...');
        }
      } else if (scanStatus.status === 'completed') {
        setCurrentActivity('Scan abgeschlossen!');
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
    if (seconds < 3600) return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  };

  const getEstimatedTotalTime = () => {
    // Based on average: ~2-3 seconds per page
    const avgTimePerPage = 2.5;
    return scanStatus.total_pages * avgTimePerPage;
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
              {scanStatus.status === 'running' ? 'läuft' : 
               scanStatus.status === 'pending' ? 'vorbereitung' : scanStatus.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fortschritt</span>
              <span>{scanStatus.scanned_pages} von {scanStatus.total_pages || '?'} Seiten</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-center text-sm text-gray-600">
              {scanStatus.total_pages > 0 ? `${Math.round(progress)}% abgeschlossen` : 'URLs werden ermittelt...'}
            </div>
          </div>

          {/* Current Activity */}
          {(scanStatus.status === 'running' || scanStatus.status === 'pending') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-800">
                    {currentActivity}
                  </div>
                  {currentUrl && (
                    <div className="text-xs text-blue-600 mt-1 break-all">
                      Aktuelle Seite: {currentUrl}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Time Estimates */}
          {scanStatus.status === 'running' && scanStatus.started_at && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="text-xs text-gray-600">Verstrichene Zeit</div>
                </div>
                
                {estimatedTimeRemaining && (
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatTime(estimatedTimeRemaining)}
                    </div>
                    <div className="text-xs text-gray-600">Verbleibend (ca.)</div>
                  </div>
                )}

                {scanStatus.total_pages > 0 && (
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {formatTime(getEstimatedTotalTime())}
                    </div>
                    <div className="text-xs text-gray-600">Geschätzte Gesamtzeit</div>
                  </div>
                )}
              </div>
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

            {scanStatus.total_pages > 0 && (
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-xl font-bold text-green-600">
                  {scanStatus.total_pages}
                </div>
                <div className="text-xs text-gray-600">Seiten insgesamt</div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            {scanStatus.started_at && (
              <div className="flex justify-between text-sm">
                <span>Gestartet:</span>
                <span>{new Date(scanStatus.started_at).toLocaleString('de-DE')}</span>
              </div>
            )}
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
              <Button onClick={() => onScanComplete?.()}>
                Ergebnisse anzeigen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Activity Timeline */}
      {(scanStatus.status === 'running' || scanStatus.status === 'pending') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Scan-Aktivitäten</span>
            </CardTitle>
            <CardDescription>
              Detaillierte Übersicht der durchgeführten Schritte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const isActive = currentActivity.includes(activity.message.split(' ')[0]);
                const isCompleted = progress > (index * 20) && scanStatus.status === 'running';
                const IconComponent = activity.icon;

                return (
                  <div 
                    key={activity.phase}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-50 border border-blue-200' 
                        : isCompleted 
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'bg-blue-100' 
                        : isCompleted 
                        ? 'bg-green-100'
                        : 'bg-gray-100'
                    }`}>
                      {isActive ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <IconComponent className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        isActive 
                          ? 'text-blue-800' 
                          : isCompleted 
                          ? 'text-green-800'
                          : 'text-gray-500'
                      }`}>
                        {activity.message}
                      </div>
                      {isActive && (
                        <div className="text-xs text-blue-600 mt-1">
                          Wird gerade ausgeführt...
                        </div>
                      )}
                      {isCompleted && !isActive && (
                        <div className="text-xs text-green-600 mt-1">
                          Abgeschlossen
                        </div>
                      )}
                    </div>
                    {isActive && scanSpeed > 0 && (
                      <div className="text-xs text-blue-600">
                        {scanSpeed.toFixed(1)} Seiten/s
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScanProgress;
