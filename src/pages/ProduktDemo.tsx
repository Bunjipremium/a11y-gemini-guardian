
import { Play, CheckCircle, AlertTriangle, XCircle, Eye, Download, BarChart3, Shield, Target, Zap, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '@/components/PublicLayout';

const ProduktDemo = () => {
  const navigate = useNavigate();

  const demoResults = {
    score: 73,
    totalIssues: 24,
    critical: 3,
    warning: 8,
    info: 13,
    pagesScanned: 47,
    timeElapsed: '2:34'
  };

  const issueCategories = [
    {
      title: 'Kritische Probleme',
      count: 3,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: XCircle,
      issues: [
        'Bilder ohne Alt-Text (12 Instanzen)',
        'Unzureichender Farbkontrast (8 Instanzen)',
        'Fehlende Hauptnavigation-Labels (3 Instanzen)'
      ]
    },
    {
      title: 'Warnungen',
      count: 8,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: AlertTriangle,
      issues: [
        'Fehlende Seitentitel-Struktur',
        'Unklare Link-Beschreibungen',
        'Formulare ohne Labels'
      ]
    },
    {
      title: 'Verbesserungen',
      count: 13,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: CheckCircle,
      issues: [
        'Optimierungspotential bei Überschriften-Hierarchie',
        'Verbesserung der Tastaturnavigation',
        'Erweiterte Aria-Labels empfohlen'
      ]
    }
  ];

  const featureHighlights = [
    {
      icon: Shield,
      title: 'WCAG 2.2 Compliance',
      description: 'Vollständige Prüfung aller WCAG 2.2 AA und AAA Kriterien',
      features: [
        'Automatische Erkennung von 100+ Accessibility-Problemen',
        'Detaillierte Compliance-Berichte nach WCAG-Prinzipien',
        'Rechtssichere Dokumentation für Audits'
      ]
    },
    {
      icon: Eye,
      title: 'Visual Testing',
      description: 'Screenshots und visuelle Kontrastprüfung in Echtzeit',
      features: [
        'Automatische Screenshot-Erstellung aller Seiten',
        'Farbkontrast-Analyse (AA/AAA Level)',
        'Visuelle Markierung problematischer Bereiche'
      ]
    },
    {
      icon: BarChart3,
      title: 'Detaillierte Analyse',
      description: 'Umfassende Berichte mit priorisierten Handlungsempfehlungen',
      features: [
        'Issue-Kategorisierung nach Schweregrad',
        'Fortschritts-Tracking über Zeit',
        'Export in PDF, Excel und JSON'
      ]
    },
    {
      icon: Zap,
      title: 'Automatisierte Scans',
      description: 'Kontinuierliche Überwachung und regelmäßige Prüfungen',
      features: [
        'Geplante Scans (täglich, wöchentlich, monatlich)',
        'E-Mail-Benachrichtigungen bei neuen Issues',
        'API-Integration für CI/CD-Pipelines'
      ]
    }
  ];

  const mockupScreenshots = [
    {
      title: 'Dashboard Übersicht',
      description: 'Zentrale Übersicht aller Websites und deren Compliance-Status',
      image: '/api/placeholder/800/500',
      features: [
        'Website-Portfolio Management',
        'Compliance-Score auf einen Blick',
        'Letzte Scan-Ergebnisse',
        'Trend-Analyse'
      ]
    },
    {
      title: 'Scan-Ergebnisse',
      description: 'Detaillierte Analyse mit WCAG 2.2 Compliance-Auswertung',
      image: '/api/placeholder/800/500',
      features: [
        'Issue-Kategorisierung nach Schweregrad',
        'WCAG-Prinzipien Aufschlüsselung',
        'Seiten-spezifische Probleme',
        'Interaktive Charts und Statistiken'
      ]
    },
    {
      title: 'Expert Reports',
      description: 'KI-generierte, professionelle WCAG 2.2 Compliance-Berichte',
      image: '/api/placeholder/800/500',
      features: [
        'Automatische Report-Generierung',
        'Verschiedene Report-Typen (Summary, Detailed, Executive)',
        'Mehrsprachige Unterstützung',
        'PDF/Excel Export'
      ]
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
                Live Demo
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Sehen Sie A11y Inspector
                <span className="text-blue-600"> in Aktion</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Erleben Sie, wie einfach und schnell Sie Ihre Website auf 
                WCAG 2.2-Compliance prüfen können - mit echten Screenshots unserer Benutzeroberfläche.
              </p>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                onClick={() => navigate('/auth')}
              >
                <Play className="mr-2 w-5 h-5" />
                Eigene Demo starten
              </Button>
            </div>
          </div>
        </section>

        {/* Live Demo Interface */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Live Demo: WCAG 2.2 Website-Analyse
                </h2>
                <p className="text-lg text-gray-600">
                  Beispiel-Analyse der Website "beispiel-shop.de" mit echten A11y Inspector Daten
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Scan Overview */}
                <div className="lg:col-span-2">
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl text-gray-900">
                            Website-Analyse: beispiel-shop.de
                          </CardTitle>
                          <CardDescription className="text-gray-600 mt-2">
                            Vollständige WCAG 2.2 AA Compliance-Prüfung
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Abgeschlossen
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Score */}
                      <div className="text-center bg-gray-50 rounded-lg p-6">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {demoResults.score}%
                        </div>
                        <div className="text-lg text-gray-700 mb-4">Compliance Score</div>
                        <Progress value={demoResults.score} className="w-full h-3" />
                        <p className="text-sm text-gray-600 mt-2">
                          {demoResults.pagesScanned} Seiten in {demoResults.timeElapsed} Min analysiert
                        </p>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{demoResults.critical}</div>
                          <div className="text-sm text-red-700">Kritisch</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">{demoResults.warning}</div>
                          <div className="text-sm text-yellow-700">Warnungen</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{demoResults.info}</div>
                          <div className="text-sm text-blue-700">Hinweise</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-600">{demoResults.totalIssues}</div>
                          <div className="text-sm text-gray-700">Gesamt</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>PDF-Bericht</span>
                        </Button>
                        <Button variant="outline" className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4" />
                          <span>Detailanalyse</span>
                        </Button>
                        <Button variant="outline" className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>Screenshots</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Issue Categories */}
                <div className="space-y-6">
                  {issueCategories.map((category, index) => (
                    <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.bgColor}`}>
                              <category.icon className={`w-5 h-5 ${category.color}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-gray-900">{category.title}</CardTitle>
                              <div className={`text-2xl font-bold ${category.color}`}>
                                {category.count}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {category.issues.map((issue, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* UI Screenshots Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Echte Screenshots unserer Benutzeroberfläche
              </h2>
              <p className="text-lg text-gray-600">
                So sieht A11y Inspector in der Praxis aus - intuitive Bedienung, professionelle Berichte
              </p>
            </div>

            <div className="space-y-16">
              {mockupScreenshots.map((screenshot, index) => (
                <div key={index} className={`grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div>
                      <Badge className="mb-3 bg-purple-100 text-purple-800">
                        Screenshot {index + 1}
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {screenshot.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6">
                        {screenshot.description}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Key Features:</h4>
                      <ul className="space-y-2">
                        {screenshot.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <Card className="overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
                      <div className="bg-gray-800 p-3 flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="flex-1 text-center">
                          <span className="text-gray-300 text-sm">A11y Inspector Dashboard</span>
                        </div>
                      </div>
                      <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                            <Eye className="w-12 h-12 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">{screenshot.title}</h4>
                            <p className="text-sm text-gray-600 mt-2">Live UI Screenshot</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Details */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Detaillierte Feature-Übersicht
              </h2>
              <p className="text-lg text-gray-600">
                Alles, was Sie für eine vollständige WCAG 2.2 Compliance brauchen
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {featureHighlights.map((feature, index) => (
                <Card key={index} className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Demo CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                Bereit für Ihre eigene Website-Analyse?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Starten Sie jetzt Ihre kostenlose Testphase und erleben Sie, 
                wie einfach WCAG 2.2-Compliance mit A11y Inspector sein kann.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                  onClick={() => navigate('/auth')}
                >
                  <Target className="mr-2 w-5 h-5" />
                  Kostenlos testen
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                  onClick={() => navigate('/produkt/preise')}
                >
                  <Users className="mr-2 w-5 h-5" />
                  Preise ansehen
                </Button>
              </div>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="text-white">
                  <div className="text-2xl font-bold mb-1">47</div>
                  <div className="text-blue-100 text-sm">Seiten analysiert</div>
                </div>
                <div className="text-white">
                  <div className="text-2xl font-bold mb-1">2:34</div>
                  <div className="text-blue-100 text-sm">Minuten Scanzeit</div>
                </div>
                <div className="text-white">
                  <div className="text-2xl font-bold mb-1">73%</div>
                  <div className="text-blue-100 text-sm">Compliance Score</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default ProduktDemo;
