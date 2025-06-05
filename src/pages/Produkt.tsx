
import { Shield, Star, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const Produkt = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'WCAG 2.2 Compliance',
      description: 'Vollständige Überprüfung aller WCAG 2.2 Richtlinien mit detaillierten Empfehlungen.'
    },
    {
      icon: Zap,
      title: 'Blitzschnelle Analyse',
      description: 'Analysieren Sie Ihre gesamte Website in wenigen Minuten statt Wochen.'
    },
    {
      icon: Users,
      title: 'Benutzerfreundlich',
      description: 'Intuitive Benutzeroberfläche - keine technischen Kenntnisse erforderlich.'
    }
  ];

  const benefits = [
    'Vermeidung von Bußgeldern bis zu €100.000',
    'Erreichen Sie 23% mehr Kunden',
    'Automatisierte Prüfberichte',
    'Kontinuierliche Überwachung',
    'Deutsche Rechtssicherheit',
    'Export in alle gängigen Formate'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                WCAG 2.2 Ready
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Die <span className="text-blue-600">intelligente</span> Lösung für
                <span className="text-purple-600"> barrierefreie</span> Websites
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                A11y Inspector macht Ihre Website automatisch WCAG 2.2-konform und schützt Sie vor
                kostspieligen Bußgeldern. Schnell, präzise und rechtssicher.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                  onClick={() => navigate('/produkt/demo')}
                >
                  Kostenlose Demo starten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
                  onClick={() => navigate('/produkt/preise')}
                >
                  Preise ansehen
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Warum A11y Inspector?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Entwickelt von Accessibility-Experten für maximale Rechtssicherheit
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Ihre Vorteile auf einen Blick
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Bereit für eine barrierefreie Website?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Starten Sie noch heute und machen Sie Ihre Website WCAG 2.2-konform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() => navigate('/auth')}
              >
                Jetzt kostenlos testen
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                onClick={() => navigate('/produkt/features')}
              >
                Alle Features ansehen
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Produkt;
