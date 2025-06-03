
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Search, 
  Brain, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  Globe,
  Zap,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: 'Automatisiertes Crawling',
      description: 'Intelligente Website-Durchsuchung mit konfigurierbarer Tiefe und Rate-Limiting'
    },
    {
      icon: Shield,
      title: 'WCAG 2.2 AA Compliance',
      description: 'Vollständige Prüfung nach den neuesten Web Content Accessibility Guidelines'
    },
    {
      icon: Brain,
      title: 'KI-basierte Erklärungen',
      description: 'Google Gemini AI liefert verständliche Erklärungen und Lösungsvorschläge'
    },
    {
      icon: BarChart3,
      title: 'Detaillierte Reports',
      description: 'Umfassende Berichte mit Prioritäten und actionable Insights'
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Schnell & Effizient',
      description: 'Automatisierte Scans sparen Zeit und Ressourcen'
    },
    {
      icon: Users,
      title: 'Benutzerfreundlich',
      description: 'Intuitive Oberfläche für Entwickler und Nicht-Techniker'
    },
    {
      icon: Globe,
      title: 'Skalierbar',
      description: 'Von einzelnen Seiten bis zu großen Websites'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">A11y Inspector</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Anmelden
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Jetzt starten
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Website-Accessibility 
            <span className="text-blue-600"> automatisiert prüfen</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professionelle WCAG 2.2 AA Compliance-Prüfung mit KI-gestützten 
            Erklärungen und konkreten Verbesserungsvorschlägen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="flex items-center space-x-2"
            >
              <span>Kostenlos testen</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              Demo ansehen
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Leistungsstarke Features
          </h2>
          <p className="text-lg text-gray-600">
            Alles was Sie für professionelle Accessibility-Tests benötigen
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Warum A11y Inspector?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bereit für barrierefreie Websites?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Starten Sie noch heute mit der professionellen Accessibility-Prüfung 
            Ihrer Website. Kostenlos und ohne Verpflichtung.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="flex items-center space-x-2 mx-auto"
          >
            <span>Jetzt kostenlos starten</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-6 h-6" />
            <span className="text-lg font-semibold">A11y Inspector</span>
          </div>
          <p className="text-gray-400">
            Professionelle WCAG 2.2 Compliance-Prüfung für eine barrierefreie digitale Welt
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
