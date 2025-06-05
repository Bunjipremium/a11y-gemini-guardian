
import { Building, Mail, Phone, Globe, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/components/PublicLayout';

const RechtlichesImpressum = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              Rechtliche Informationen
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Impressum
            </h1>
            <p className="text-lg text-gray-600">
              Angaben gemäß § 5 TMG
            </p>
          </div>

          {/* Company Information */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Building className="w-8 h-8 text-blue-600" />
                <CardTitle className="text-2xl">Anbieter</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">WebAccessibility GmbH</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Anschrift</h4>
                    <p className="text-gray-600">
                      TBD Straße TBD<br />
                      TBD München<br />
                      Deutschland
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Registrierung</h4>
                    <p className="text-gray-600">
                      Handelsregister: TBD<br />
                      Registergericht: TBD<br />
                      USt-IdNr.: TBD
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl">Kontakt</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-700">Telefon</h4>
                    <p className="text-gray-600">TBD</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-700">E-Mail</h4>
                    <p className="text-gray-600">TBD</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-700">Internet</h4>
                    <p className="text-gray-600">a11y-inspector.de</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Management */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl">Geschäftsführung</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">TBD</h4>
                  <p className="text-gray-600 text-sm">
                    Geschäftsführer und CTO<br />
                    Experte für Web-Accessibility und WCAG-Standards
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">TBD</h4>
                  <p className="text-gray-600 text-sm">
                    Geschäftsführerin und CEO<br />
                    Spezialistin für digitale Barrierefreiheit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Information */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl">Rechtliche Hinweise</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Berufsbezeichnung</h4>
                <p className="text-gray-600">
                  Softwareentwicklung und IT-Dienstleistungen (verliehen in Deutschland)
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Aufsichtsbehörde</h4>
                <p className="text-gray-600">
                  TBD<br />
                  TBD<br />
                  TBD München
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Berufsrechtliche Regelungen</h4>
                <p className="text-gray-600">
                  Gewerbeordnung (GewO)<br />
                  Bundesdatenschutzgesetz (BDSG)<br />
                  Datenschutz-Grundverordnung (DSGVO)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Resolution */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Streitschlichtung</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p className="mb-4">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="mb-4">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </CardContent>
          </Card>

          {/* Liability */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Haftung für Inhalte</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
                fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
                rechtswidrige Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
                erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
                Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <div className="text-center text-sm text-gray-500">
            <p>
              Letzte Aktualisierung: 5. Juni 2025
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default RechtlichesImpressum;
