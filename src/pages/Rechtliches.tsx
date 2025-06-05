import { Shield, FileText, Scale, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '@/components/PublicLayout';

const Rechtliches = () => {
  const navigate = useNavigate();

  const legalSections = [
    {
      icon: Shield,
      title: 'Datenschutz',
      description: 'Erfahren Sie, wie wir Ihre Daten schützen und verwenden.',
      link: '/rechtliches/datenschutz',
      highlights: [
        'DSGVO-konform',
        'Keine Weitergabe an Dritte',
        'Verschlüsselte Übertragung'
      ]
    },
    {
      icon: FileText,
      title: 'Impressum',
      description: 'Alle Informationen über unser Unternehmen und Kontaktdaten.',
      link: '/rechtliches/impressum',
      highlights: [
        'Vollständige Anbieterangaben',
        'Registrierungsdaten',
        'Kontaktinformationen'
      ]
    },
    {
      icon: Scale,
      title: 'AGB',
      description: 'Unsere Allgemeinen Geschäftsbedingungen im Detail.',
      link: '/rechtliches/agb',
      highlights: [
        'Transparente Konditionen',
        'Faire Kündigungsregeln',
        'Klare Leistungsbeschreibung'
      ]
    }
  ];

  const trustFactors = [
    {
      icon: Shield,
      title: 'ISO 27001 zertifiziert',
      description: 'Höchste Standards für Informationssicherheit'
    },
    {
      icon: Users,
      title: 'DSGVO-konform',
      description: 'Vollständige Einhaltung der EU-Datenschutzgrundverordnung'
    },
    {
      icon: FileText,
      title: 'Transparente AGB',
      description: 'Faire und verständliche Geschäftsbedingungen'
    },
    {
      icon: CheckCircle,
      title: 'Deutsche Rechtssicherheit',
      description: 'Nach deutschem Recht entwickelt und betrieben'
    }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                Rechtliche Informationen
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Transparenz und
                <span className="text-blue-600"> Rechtssicherheit</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Alle wichtigen rechtlichen Informationen zu A11y Inspector auf einen Blick. 
                Wir legen größten Wert auf Transparenz und Datenschutz.
              </p>
            </div>
          </div>
        </section>

        {/* Legal Sections */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Rechtliche Dokumente
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {legalSections.map((section, index) => (
                <Card key={index} className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <section.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">{section.title}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {section.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => navigate(section.link)}
                    >
                      Vollständig lesen
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Factors */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Warum Sie uns vertrauen können
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {trustFactors.map((factor, index) => (
                <Card key={index} className="text-center border-2 hover:border-blue-200 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <factor.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{factor.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {factor.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Haben Sie Fragen zu rechtlichen Themen?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Unser Rechts- und Datenschutzteam steht Ihnen gerne zur Verfügung.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Datenschutz-Anfragen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Für alle Fragen zum Datenschutz und zur DSGVO
                    </p>
                    <Button variant="outline" className="w-full">
                      datenschutz@a11y-inspector.de
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Rechtliche Fragen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Für allgemeine rechtliche Anfragen und AGB-Fragen
                    </p>
                    <Button variant="outline" className="w-full">
                      legal@a11y-inspector.de
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Rechtssicher starten
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Mit A11y Inspector sind Sie nicht nur WCAG 2.2-konform, sondern auch 
              rechtlich auf der sicheren Seite.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/auth')}
            >
              Jetzt kostenlos testen
            </Button>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default Rechtliches;
