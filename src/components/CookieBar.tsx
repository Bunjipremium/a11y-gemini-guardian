
import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const CookieBar = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Immer erforderlich
    analytics: false,
    marketing: false,
    functional: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Prüfen, ob bereits eine Einwilligung erteilt wurde
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      setConsent(JSON.parse(savedConsent));
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setConsent(allConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(allConsent));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setConsent(minimalConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(minimalConsent));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleConsentChange = (type: keyof CookieConsent, value: boolean) => {
    if (type === 'necessary') return; // Necessary cookies können nicht deaktiviert werden
    setConsent(prev => ({
      ...prev,
      [type]: value
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <Cookie className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Wir verwenden Cookies
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        DSGVO-konform
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Wir nutzen Cookies und ähnliche Technologien, um Ihnen die bestmögliche Nutzererfahrung zu bieten, 
                      unsere Website zu verbessern und um Ihnen relevante Inhalte anzuzeigen. Durch Klicken auf "Alle akzeptieren" 
                      stimmen Sie der Verwendung aller Cookies zu. Sie können Ihre Einstellungen jederzeit anpassen.
                    </p>
                    <div className="mt-2">
                      <button
                        onClick={() => navigate('/rechtliches/datenschutz')}
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        Mehr in unserer Datenschutzerklärung
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Einstellungen</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <span>Cookie-Einstellungen</span>
                        </DialogTitle>
                        <DialogDescription>
                          Verwalten Sie Ihre Cookie-Präferenzen. Sie können diese Einstellungen jederzeit ändern.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        {/* Notwendige Cookies */}
                        <div className="flex items-start justify-between space-x-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Notwendige Cookies</h4>
                            <p className="text-sm text-gray-600">
                              Diese Cookies sind für das Funktionieren der Website erforderlich und können nicht deaktiviert werden.
                            </p>
                          </div>
                          <Switch 
                            checked={consent.necessary} 
                            disabled={true}
                            className="mt-1"
                          />
                        </div>

                        {/* Analytics Cookies */}
                        <div className="flex items-start justify-between space-x-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Analyse-Cookies</h4>
                            <p className="text-sm text-gray-600">
                              Helfen uns zu verstehen, wie Besucher mit der Website interagieren, indem Informationen anonym gesammelt werden.
                            </p>
                          </div>
                          <Switch 
                            checked={consent.analytics} 
                            onCheckedChange={(checked) => handleConsentChange('analytics', checked)}
                            className="mt-1"
                          />
                        </div>

                        {/* Marketing Cookies */}
                        <div className="flex items-start justify-between space-x-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Marketing-Cookies</h4>
                            <p className="text-sm text-gray-600">
                              Werden verwendet, um Besuchern relevante Anzeigen und Marketingkampagnen anzubieten.
                            </p>
                          </div>
                          <Switch 
                            checked={consent.marketing} 
                            onCheckedChange={(checked) => handleConsentChange('marketing', checked)}
                            className="mt-1"
                          />
                        </div>

                        {/* Funktionale Cookies */}
                        <div className="flex items-start justify-between space-x-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Funktionale Cookies</h4>
                            <p className="text-sm text-gray-600">
                              Ermöglichen verbesserte Funktionalität und Personalisierung, wie Videos und Live-Chat.
                            </p>
                          </div>
                          <Switch 
                            checked={consent.functional} 
                            onCheckedChange={(checked) => handleConsentChange('functional', checked)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                        <Button onClick={handleSaveSettings} className="flex-1">
                          Einstellungen speichern
                        </Button>
                        <Button variant="outline" onClick={() => setShowSettings(false)} className="flex-1">
                          Abbrechen
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    onClick={handleRejectAll}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Nur notwendige
                  </Button>
                  <Button 
                    onClick={handleAcceptAll}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Alle akzeptieren
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CookieBar;
