
import { 
  Shield, 
  Zap, 
  FileText, 
  BarChart3, 
  Globe, 
  Users,
  CheckCircle,
  Download,
  Clock,
  AlertTriangle,
  Eye,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const ProduktFeatures = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: Shield,
      title: 'WCAG 2.2 AA Compliance',
      description: 'Vollständige Überprüfung aller 78 WCAG 2.2 Success Criteria auf Level AA.',
      details: [
        'Alle 13 Richtlinien abgedeckt',
        'Deutsche Rechtssicherheit',
        'Aktuelle EU-Accessibility-Standards',
        'Kontinuierliche Updates'
      ]
    },
    {
      icon: Zap,
      title: 'Blitzschnelle Analyse',
      description: 'Komplette Website-Analyse in wenigen Minuten statt Wochen.',
      details: [
        'Bis zu 1000 Seiten pro Scan',
        'Parallel-Processing',
        'Real-time Ergebnisse',
        'Smart Crawling Algorithmus'
      ]
    },
    {
      icon: FileText,
      title: 'Detaillierte Berichte',
      description: 'Umfassende Prüfberichte mit konkreten Handlungsempfehlungen.',
      details: [
        'PDF & Excel Export',
        'Executive Summary',
        'Technische Details',
        'Priorisierte To-Do-Liste'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics & Monitoring',
      description: 'Kontinuierliche Überwachung und Fortschrittsmessung.',
      details: [
        'Compliance Score',
        'Trend-Analysen',
        'Benchmark-Vergleiche',
        'Automated Alerts'
      ]
    }
  ];

  const technicalFeatures = [
    {
      icon: Globe,
      title: 'Multi-Site Management',
      description: 'Verwalten Sie beliebig viele Websites zentral.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Arbeiten Sie im Team mit Rollen und Berechtigungen.'
    },
    {
      icon: Download,
      title: 'API Integration',
      description: 'RESTful API für Entwickler und CI/CD-Integration.'
    },
    {
      icon: Clock,
      title: 'Scheduled Scans',
      description: 'Automatische regelmäßige Überprüfungen.'
    },
    {
      icon: AlertTriangle,
      title: 'Smart Alerts',
      description: 'Intelligente Benachrichtigungen bei kritischen Issues.'
    },
    {
      icon: Eye,
      title: 'Visual Testing',
      description: 'Screenshot-basierte Farb- und Kontrastprüfung.'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                Alle Features
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Leistungsstarke Features für
                <span className="text-blue-600"> perfekte Accessibility</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Entdecken Sie alle Funktionen, die A11y Inspector zur umfassendsten 
                WCAG 2.2-Lösung auf dem Markt machen.
              </p>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Kern-Features
            </h2>
            
            <div className="space-y-12">
              {mainFeatures.map((feature, index) => (
                <div key={index} className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <Card className="h-full border-2 hover:border-blue-200 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <feature.icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-gray-900">{feature.title}</CardTitle>
                          </div>
                        </div>
                        <CardDescription className="text-gray-600 text-lg">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {feature.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-64 flex items-center justify-center">
                      <feature.icon className="w-32 h-32 text-blue-600 opacity-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Erweiterte Funktionen
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technicalFeatures.map((feature, index) => (
                <Card key={index} className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Überzeugt von unseren Features?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Testen Sie A11y Inspector 14 Tage kostenlos und unverbindlich.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() => navigate('/auth')}
              >
                Kostenlos testen
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                onClick={() => navigate('/produkt/demo')}
              >
                Live Demo ansehen
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProduktFeatures;
