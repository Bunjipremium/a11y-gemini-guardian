
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import ScanProgress from '@/components/ScanProgress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Plus, 
  Search, 
  Settings, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface Website {
  id: string;
  name: string;
  base_url: string;
  max_depth: number;
  max_pages: number;
  rate_limit_ms: number;
  created_at: string;
  updated_at: string;
}

const Websites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);
  const [scanningWebsites, setScanningWebsites] = useState<Set<string>>(new Set());
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    base_url: '',
    max_depth: 3,
    max_pages: 100,
    rate_limit_ms: 1000
  });

  useEffect(() => {
    if (user) {
      fetchWebsites();
    }
  }, [user]);

  const fetchWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebsites(data || []);
    } catch (error) {
      console.error('Error fetching websites:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Laden der Websites',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingWebsite(true);

    try {
      // Validate URL
      const url = new URL(formData.base_url);
      
      const { data, error } = await supabase
        .from('websites')
        .insert([{
          ...formData,
          base_url: url.toString(),
          user_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      setWebsites([data, ...websites]);
      setFormData({
        name: '',
        base_url: '',
        max_depth: 3,
        max_pages: 100,
        rate_limit_ms: 1000
      });

      toast({
        title: 'Erfolg',
        description: 'Website wurde erfolgreich hinzugefügt'
      });
    } catch (error: any) {
      console.error('Error adding website:', error);
      toast({
        title: 'Fehler',
        description: error.message === 'Invalid URL' 
          ? 'Bitte geben Sie eine gültige URL ein'
          : 'Fehler beim Hinzufügen der Website',
        variant: 'destructive'
      });
    } finally {
      setIsAddingWebsite(false);
    }
  };

  const deleteWebsite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWebsites(websites.filter(w => w.id !== id));
      toast({
        title: 'Erfolg',
        description: 'Website wurde gelöscht'
      });
    } catch (error) {
      console.error('Error deleting website:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Löschen der Website',
        variant: 'destructive'
      });
    }
  };

  const startScan = async (websiteId: string) => {
    setScanningWebsites(prev => new Set(prev).add(websiteId));
    
    try {
      // Create scan record
      const { data: scanData, error: scanError } = await supabase
        .from('scans')
        .insert([{
          website_id: websiteId,
          status: 'pending'
        }])
        .select()
        .single();

      if (scanError) throw scanError;

      // Show scan progress immediately
      setActiveScanId(scanData.id);

      toast({
        title: 'Scan wird gestartet',
        description: 'Der Accessibility-Scan wird im Hintergrund durchgeführt'
      });

      // Start the actual crawling process
      try {
        const { data: crawlResponse, error: crawlError } = await supabase.functions.invoke('crawl-website', {
          body: {
            websiteId: websiteId,
            scanId: scanData.id
          }
        });

        if (crawlError) {
          console.error('Crawl function error:', crawlError);
          toast({
            title: 'Warnung',
            description: 'Scan wurde erstellt, aber der Crawl-Prozess konnte nicht gestartet werden',
            variant: 'destructive'
          });
        } else {
          console.log('Crawl started successfully:', crawlResponse);
        }
      } catch (functionError) {
        console.error('Function invocation error:', functionError);
        toast({
          title: 'Warnung', 
          description: 'Scan wurde erstellt, aber der Crawl-Prozess konnte nicht gestartet werden',
          variant: 'destructive'
        });
      }

    } catch (error) {
      console.error('Error starting scan:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Starten des Scans',
        variant: 'destructive'
      });
      setActiveScanId(null);
    } finally {
      setScanningWebsites(prev => {
        const newSet = new Set(prev);
        newSet.delete(websiteId);
        return newSet;
      });
    }
  };

  const handleScanComplete = () => {
    if (activeScanId) {
      // Navigate to scan results when complete
      navigate(`/scan/${activeScanId}`);
    }
  };

  const handleBackToWebsites = () => {
    setActiveScanId(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  // Show scan progress if there's an active scan
  if (activeScanId) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleBackToWebsites}
              className="flex items-center space-x-2"
            >
              <span>← Zurück zu Websites</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Scan läuft
              </h1>
              <p className="text-gray-600">Accessibility-Scan wird durchgeführt</p>
            </div>
          </div>
          
          <ScanProgress 
            scanId={activeScanId} 
            onScanComplete={handleScanComplete}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Website Management
            </h1>
            <p className="text-gray-600">
              Verwalten Sie Ihre Websites und starten Sie Accessibility-Scans
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Website hinzufügen</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Website hinzufügen</DialogTitle>
                <DialogDescription>
                  Fügen Sie eine neue Website hinzu, um Accessibility-Scans durchzuführen.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={addWebsite} className="space-y-4">
                <div>
                  <Label htmlFor="name">Website Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Meine Website"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="base_url">URL</Label>
                  <Input
                    id="base_url"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.base_url}
                    onChange={(e) => setFormData({...formData, base_url: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max_depth">Max. Tiefe</Label>
                    <Input
                      id="max_depth"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.max_depth}
                      onChange={(e) => setFormData({...formData, max_depth: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="max_pages">Max. Seiten</Label>
                    <Input
                      id="max_pages"
                      type="number"
                      min="1"
                      max="1000"
                      value={formData.max_pages}
                      onChange={(e) => setFormData({...formData, max_pages: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="rate_limit_ms">Rate Limit (ms)</Label>
                  <Input
                    id="rate_limit_ms"
                    type="number"
                    min="100"
                    max="10000"
                    value={formData.rate_limit_ms}
                    onChange={(e) => setFormData({...formData, rate_limit_ms: parseInt(e.target.value)})}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isAddingWebsite}>
                  {isAddingWebsite ? 'Wird hinzugefügt...' : 'Website hinzufügen'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {websites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Keine Websites vorhanden
              </h3>
              <p className="text-gray-500 mb-6">
                Fügen Sie Ihre erste Website hinzu, um mit Accessibility-Scans zu beginnen.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Erste Website hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neue Website hinzufügen</DialogTitle>
                    <DialogDescription>
                      Fügen Sie eine neue Website hinzu, um Accessibility-Scans durchzuführen.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={addWebsite} className="space-y-4">
                    <div>
                      <Label htmlFor="name-empty">Website Name</Label>
                      <Input
                        id="name-empty"
                        type="text"
                        placeholder="Meine Website"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="base_url-empty">URL</Label>
                      <Input
                        id="base_url-empty"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.base_url}
                        onChange={(e) => setFormData({...formData, base_url: e.target.value})}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isAddingWebsite}>
                      {isAddingWebsite ? 'Wird hinzugefügt...' : 'Website hinzufügen'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website) => (
              <Card key={website.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{website.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <span className="truncate">{website.base_url}</span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(website.base_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Max. Tiefe:</span>
                      <Badge variant="outline">{website.max_depth}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Max. Seiten:</span>
                      <Badge variant="outline">{website.max_pages}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Hinzugefügt:</span>
                      <span className="text-gray-900">
                        {new Date(website.created_at).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => startScan(website.id)}
                      disabled={scanningWebsites.has(website.id)}
                    >
                      {scanningWebsites.has(website.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Startet...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Scan starten
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteWebsite(website.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Websites;
