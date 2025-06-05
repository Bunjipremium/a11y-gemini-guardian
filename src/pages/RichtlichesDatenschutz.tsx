
import { Shield, Lock, Eye, Download, Users, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';

const RechtlichesDatenschutz = () => {
  const dataTypes = [
    {
      icon: Users,
      title: 'Persönliche Daten',
      description: 'Name, E-Mail-Adresse, Unternehmensinformationen',
      purpose: 'Account-Verwaltung und Kommunikation'
    },
    {
      icon: Server,
      title: 'Technische Daten',
      description: 'IP-Adresse, Browser-Informationen, Nutzungsstatistiken',
      purpose: 'Service-Bereitstellung und -Optimierung'
    },
    {
      icon: Eye,
      title: 'Website-Daten',
      description: 'URLs, Inhalte und Strukturdaten Ihrer analysierten Websites',
      purpose: 'Accessibility-Analyse und Berichtserstellung'
    }
  ];

  const rights = [
    'Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)',
    'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
    'Löschung Ihrer Daten (Art. 17 DSGVO)',
    'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
    'Datenübertragbarkeit (Art. 20 DSGVO)',
    'Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)',
    'Beschwerde bei der Aufsichtsbehörde (Art. 77 DSGVO)'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              DSGVO-konform
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Datenschutzerklärung
            </h1>
            <p className="text-lg text-gray-600">
              Letzte Aktualisierung: 5. Juni 2025
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <CardTitle className="text-2xl">Unser Datenschutz-Versprechen</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre 
                Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). 
                In diesen Datenschutzinformationen informieren wir Sie über die wichtigsten Aspekte der 
                Datenverarbeitung im Rahmen unserer Website und Services.
              </p>
              <p>
                A11y Inspector wird von der <strong>WebAccessibility GmbH</strong> betrieben, 
                einem deutschen Unternehmen mit Sitz in München.
              </p>
            </CardContent>
          </Card>

          {/* Data Controller */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">1. Verantwortliche Stelle</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">WebAccessibility GmbH</p>
                <p>Maximilianstraße 13</p>
                <p>80539 München, Deutschland</p>
                <p className="mt-2">
                  <strong>E-Mail:</strong> datenschutz@a11y-inspector.de<br />
                  <strong>Telefon:</strong> +49 89 123456789<br />
                  <strong>Datenschutzbeauftragter:</strong> Dr. Maria Müller
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Processing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">2. Welche Daten wir verarbeiten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dataTypes.map((type, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <type.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                        <p className="text-gray-600 mb-2">{type.description}</p>
                        <p className="text-sm text-blue-600 font-medium">
                          Zweck: {type.purpose}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">3. Rechtsgrundlage der Verarbeitung</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Art. 6 Abs. 1 lit. b DSGVO</h4>
                  <p className="text-sm">Vertragserfüllung und vorvertragliche Maßnahmen</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Art. 6 Abs. 1 lit. f DSGVO</h4>
                  <p className="text-sm">Berechtigte Interessen zur Service-Optimierung</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Art. 6 Abs. 1 lit. a DSGVO</h4>
                  <p className="text-sm">Einwilligung für Marketing und Newsletter</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Art. 6 Abs. 1 lit. c DSGVO</h4>
                  <p className="text-sm">Erfüllung rechtlicher Verpflichtungen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Lock className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl">4. Datensicherheit</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>
                Wir verwenden modernste Sicherheitsmaßnahmen, um Ihre Daten zu schützen:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS-Verschlüsselung für alle Datenübertragungen</li>
                <li>ISO 27001 zertifizierte Rechenzentren in Deutschland</li>
                <li>Regelmäßige Sicherheitsaudits und Penetrationstests</li>
                <li>Zwei-Faktor-Authentifizierung für Admin-Zugänge</li>
                <li>Automatische Backups mit Verschlüsselung</li>
                <li>Strikte Zugriffskontrolle und Logging</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Storage */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">5. Speicherdauer</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Account-Daten</h4>
                  <p className="text-sm">Bis zur Account-Löschung + 30 Tage</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Scan-Ergebnisse</h4>
                  <p className="text-sm">2 Jahre nach letztem Login</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Log-Dateien</h4>
                  <p className="text-sm">90 Tage</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Marketing-Daten</h4>
                  <p className="text-sm">Bis zum Widerruf der Einwilligung</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">6. Ihre Rechte</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
              <ul className="space-y-2">
                {rights.map((right, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  <strong>Kontakt für Datenschutz-Anfragen:</strong><br />
                  E-Mail: datenschutz@a11y-inspector.de<br />
                  Telefon: +49 89 123456789
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third Parties */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">7. Externe Dienstleister</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>Wir arbeiten mit folgenden vertrauenswürdigen Partnern zusammen:</p>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold">Hosting</h4>
                  <p className="text-sm">AWS Europe (Frankfurt) - ISO 27001 zertifiziert</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold">E-Mail-Versand</h4>
                  <p className="text-sm">SendGrid (Deutschland) - DSGVO-konform</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold">Analytics</h4>
                  <p className="text-sm">Eigene Lösung - keine Weitergabe an Dritte</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Alle Partner haben Auftragsverarbeitungsverträge nach Art. 28 DSGVO unterzeichnet.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">8. Kontakt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Allgemeine Anfragen</h4>
                  <p className="text-sm text-gray-600">kontakt@a11y-inspector.de</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Datenschutz-Anfragen</h4>
                  <p className="text-sm text-gray-600">datenschutz@a11y-inspector.de</p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="mr-4">
                  <Download className="w-4 h-4 mr-2" />
                  PDF herunterladen
                </Button>
                <Button variant="outline">
                  Datenschutz-Anfrage stellen
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <div className="text-center text-sm text-gray-500">
            <p>
              Diese Datenschutzerklärung wurde zuletzt am 5. Juni 2025 aktualisiert.<br />
              Wir behalten uns vor, diese Erklärung bei Bedarf anzupassen.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RechtlichesDatenschutz;
