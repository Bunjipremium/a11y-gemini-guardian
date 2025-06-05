
import { FileText, CheckCircle, XCircle, CreditCard, AlertTriangle, Scale } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/Layout';

const RechtlichesAGB = () => {
  const keyPoints = [
    {
      icon: CheckCircle,
      title: 'Faire Kündigungsfristen',
      description: '30 Tage Kündigungsfrist zum Monatsende'
    },
    {
      icon: CreditCard,
      title: 'Transparente Preise',
      description: 'Keine versteckten Kosten oder Zusatzgebühren'
    },
    {
      icon: FileText,
      title: 'Klare Leistungen',
      description: 'Detaillierte Beschreibung aller Services'
    },
    {
      icon: Scale,
      title: 'Deutsches Recht',
      description: 'Nach deutschem Recht und in deutscher Sprache'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              Vertragsbedingungen
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Allgemeine Geschäftsbedingungen
            </h1>
            <p className="text-lg text-gray-600">
              Gültig ab: 5. Juni 2025
            </p>
          </div>

          {/* Key Points */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Das Wichtigste im Überblick
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {keyPoints.map((point, index) => (
                <Card key={index} className="text-center border-2 hover:border-blue-200 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <point.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-base text-gray-900">{point.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {point.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 1 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">§ 1 Geltungsbereich</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>
                Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für alle 
                Leistungen der WebAccessibility GmbH (nachfolgend "A11y Inspector" oder "wir") 
                gegenüber unseren Kunden im Rahmen der Bereitstellung unserer Software-as-a-Service 
                (SaaS) Lösung für Website-Accessibility-Prüfungen.
              </p>
              <p>
                Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des 
                Kunden werden nur dann und insoweit Vertragsbestandteil, als wir ihrer Geltung 
                ausdrücklich zugestimmt haben.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">§ 2 Vertragsschluss</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>
                Der Vertrag kommt durch die Registrierung des Kunden auf unserer Plattform und 
                die anschließende Bestätigung durch uns zustande. Die Darstellung der Leistungen 
                auf unserer Website stellt kein rechtlich bindendes Angebot dar.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Registrierungsprozess:</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Eingabe der Registrierungsdaten</li>
                  <li>Bestätigung der E-Mail-Adresse</li>
                  <li>Auswahl des gewünschten Tarifs</li>
                  <li>Bestätigung durch A11y Inspector</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">§ 3 Leistungen</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>
                A11y Inspector stellt eine cloudbasierte Software zur Verfügung, die automatisierte 
                Accessibility-Prüfungen von Websites gemäß WCAG 2.2-Standards durchführt.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Inkludierte Leistungen:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• WCAG 2.2 AA/AAA Compliance-Checks</li>
                    <li>• Automated Website Crawling</li>
                    <li>• Detaillierte PDF/Excel-Berichte</li>
                    <li>• Dashboard und Analytics</li>
                    <li>• E-Mail-Support</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Je nach Tarif zusätzlich:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• API-Zugang</li>
                    <li>• Team-Collaboration</li>
                    <li>• Priority Support</li>
                    <li>• Custom Branding</li>
                    <li>• On-Premise Installation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">§ 4 Preise und Zahlungsbedingungen</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Zahlungsmodalitäten:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Abrechnung erfolgt monatlich im Voraus</li>
                    <li>Zahlung per SEPA-Lastschrift oder Kreditkarte</li>
                    <li>Rechnungsstellung am Monatsanfang</li>
                    <li>Zahlungsziel: 14 Tage nach Rechnungsstellung</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Preisanpassungen:</h4>
                  <p>
                    Preiserhöhungen werden mit einer Frist von 6 Wochen angekündigt. 
                    Der Kunde hat bei Preiserhöhungen von mehr als 5% ein außerordentliches Kündigungsrecht.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">§ 5 Laufzeit und Kündigung</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Ordentliche Kündigung:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• 30 Tage zum Monatsende</li>
                    <li>• Schriftlich oder per E-Mail</li>
                    <li>• Keine Begründung erforderlich</li>
                    <li>• Kündigungsbestätigung binnen 48h</li>
                  </ul>
                </div>
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Außerordentliche Kündigung:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Bei Zahlungsverzug {'>'}30 Tage</li>
                    <li>• Bei Vertragsverletzungen</li>
                    <li>• Bei Missbrauch der Plattform</li>
                    <li>• Sofortige Wirkung möglich</li>
                  </ul>
                </div>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Nach Vertragsende werden alle Daten binnen 30 Tagen unwiderruflich gelöscht.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">§ 6 Pflichten des Kunden</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Der Kunde verpflichtet sich:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Wahre und vollständige Angaben bei der Registrierung zu machen</li>
                    <li>Die Zugangsdaten vertraulich zu behandeln</li>
                    <li>Nur eigene oder berechtigte Websites zu prüfen</li>
                    <li>Die Plattform nicht missbräuchlich zu nutzen</li>
                    <li>Bei technischen Problemen mitzuwirken</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2">Untersagt ist insbesondere:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Reverse Engineering der Software</li>
                    <li>• Überlastung der Systeme</li>
                    <li>• Weitergabe der Zugangsdaten</li>
                    <li>• Prüfung fremder Websites ohne Berechtigung</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">§ 7 Verfügbarkeit und Support</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Service-Level:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 99,5% Verfügbarkeit (24/7)</li>
                    <li>• Geplante Wartungen angekündigt</li>
                    <li>• Automatische Backups</li>
                    <li>• Monitoring und Alerting</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Support-Zeiten:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• E-Mail: Mo-Fr 9:00-18:00</li>
                    <li>• Priority: Mo-So 8:00-20:00</li>
                    <li>• Enterprise: 24/7 verfügbar</li>
                    <li>• Antwortzeit: max. 24h</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">§ 8 Haftung</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>
                A11y Inspector haftet uneingeschränkt für Schäden aus der Verletzung des Lebens, 
                des Körpers oder der Gesundheit, die auf einer vorsätzlichen oder fahrlässigen 
                Pflichtverletzung beruhen, sowie für sonstige Schäden, die auf einer vorsätzlichen 
                oder grob fahrlässigen Pflichtverletzung beruhen.
              </p>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Haftungsbeschränkung:</h4>
                <p className="text-sm">
                  Für leicht fahrlässige Verletzungen wesentlicher Vertragspflichten ist die Haftung 
                  auf den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden begrenzt. 
                  Die Haftung für mittelbare Schäden, Folgeschäden und entgangenen Gewinn ist ausgeschlossen.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">§ 9 Schlussbestimmungen</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Anwendbares Recht:</h4>
                  <p>Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Gerichtsstand:</h4>
                  <p>
                    Ausschließlicher Gerichtsstand ist München, sofern der Kunde Kaufmann, 
                    juristische Person des öffentlichen Rechts oder öffentlich-rechtliches 
                    Sondervermögen ist.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Salvatorische Klausel:</h4>
                  <p>
                    Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die 
                    Wirksamkeit der übrigen Bestimmungen unberührt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <div className="text-center text-sm text-gray-500">
            <p>
              WebAccessibility GmbH • Maximilianstraße 13 • 80539 München<br />
              Stand: 5. Juni 2025 • Version 2.1
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RechtlichesAGB;
