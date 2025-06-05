
import { Play, CheckCircle, AlertTriangle, XCircle, Eye, Download, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

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

  return (
    <Layout>
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
                WCAG 2.2-Compliance prüfen können.
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

        {/* Demo Interface */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
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

        {/* Features Showcase */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Das bekommen Sie mit A11y Inspector
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="text-center border-2 hover:border-blue-200 transition-all duration-300">
                <CardHeader>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-lg">Sofortige Ergebnisse</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Komplette Website-Analyse in wenigen Minuten
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-2 hover:border-blue-200 transition-all duration-300">
                <CardHeader>
                  <Download className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <CardTitle className="text-lg">Detaillierte Berichte</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    PDF und Excel-Export für Ihre Dokumentation
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-2 hover:border-blue-200 transition-all duration-300">
                <CardHeader>
                  <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <CardTitle className="text-lg">Fortschritts-Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Verfolgen Sie Verbesserungen über die Zeit
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center border-2 hover:border-blue-200 transition-all duration-300">
                <CardHeader>
                  <Eye className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <CardTitle className="text-lg">Visual Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Screenshots und Kontrastprüfung inklusive
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Bereit für Ihre eigene Analyse?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Starten Sie jetzt Ihre kostenlose Testphase und erleben Sie, 
              wie einfach WCAG 2.2-Compliance sein kann.
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
                onClick={() => navigate('/produkt/preise')}
              >
                Preise ansehen
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProduktDemo;
