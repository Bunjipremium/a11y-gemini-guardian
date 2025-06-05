
import { ArrowRight, Shield, Zap, Users, CheckCircle, Star, BarChart3, Globe, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PublicLayout from '@/components/PublicLayout';
import CookieBar from '@/components/CookieBar';

const Index = () => {
  const stats = [
    { label: 'Websites gescannt', value: '50,000+', icon: Globe },
    { label: 'Barrieren gefunden', value: '2.5M+', icon: CheckCircle },
    { label: 'Zufriedene Kunden', value: '1,200+', icon: Users },
    { label: 'WCAG-Konformität', value: '99.9%', icon: Award },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Blitzschnelle Scans',
      description: 'Vollständige Accessibility-Prüfung Ihrer Website in unter 60 Sekunden',
    },
    {
      icon: Shield,
      title: 'WCAG 2.1 AA Konform',
      description: 'Umfassende Prüfung nach den neuesten Web Content Accessibility Guidelines',
    },
    {
      icon: BarChart3,
      title: 'Detaillierte Reports',
      description: 'Ausführliche Berichte mit konkreten Handlungsempfehlungen und Prioritäten',
    },
    {
      icon: Clock,
      title: 'Kontinuierliches Monitoring',
      description: 'Automatische Überwachung und Benachrichtigungen bei neuen Accessibility-Problemen',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Weber',
      role: 'IT-Leiterin, Stadtwerke München',
      content: 'A11y Inspector hat uns geholfen, unsere Website vollständig barrierefrei zu gestalten. Die detaillierten Reports sind Gold wert.',
      rating: 5,
    },
    {
      name: 'Michael Hoffmann',
      role: 'Web Developer, TechCorp GmbH',
      content: 'Endlich ein Tool, das nicht nur Probleme findet, sondern auch konkrete Lösungsvorschläge bietet. Absolut empfehlenswert!',
      rating: 5,
    },
    {
      name: 'Lisa Müller',
      role: 'UX Designerin, Digital Agency',
      content: 'Die kontinuierliche Überwachung gibt uns die Sicherheit, dass unsere Websites immer accessibility-konform bleiben.',
      rating: 5,
    },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl mx-4"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                🚀 Neu: Automatisierte WCAG 2.1 AA Prüfung
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Web Accessibility{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  leicht gemacht
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Prüfen Sie Ihre Website automatisch auf Barrierefreiheit nach WCAG 2.1 AA Standards. 
                Erhalten Sie detaillierte Reports und konkrete Handlungsempfehlungen für eine inklusive Web-Erfahrung.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Kostenlos testen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  Live Demo ansehen
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Keine Kreditkarte erforderlich
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  14 Tage kostenlos
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  DSGVO-konform
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-indigo-100 text-indigo-800 border-indigo-200">
                Features
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Alles was Sie für barrierefreie Websites brauchen
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Unsere umfassende Lösung hilft Ihnen dabei, Ihre Website für alle Nutzer zugänglich zu machen
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white">
                    <CardHeader>
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
                Kundenstimmen
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Das sagen unsere Kunden
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="border-t pt-4">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Bereit für eine barrierefreie Website?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Starten Sie noch heute mit der kostenlosen Prüfung Ihrer Website. 
              Keine Anmeldung erforderlich für den ersten Scan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Jetzt kostenlos testen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                Beratung vereinbaren
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      {/* Cookie Bar */}
      <CookieBar />
    </PublicLayout>
  );
};

export default Index;
