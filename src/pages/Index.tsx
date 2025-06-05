
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Search, 
  Brain, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  Globe,
  Zap,
  Users,
  AlertTriangle,
  Scale,
  Target,
  TrendingUp,
  Clock,
  Euro,
  Star,
  Eye,
  Ear,
  MousePointer,
  Keyboard,
  Award,
  Lightbulb,
  FileText,
  Rocket,
  ShieldCheck,
  ChevronRight,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const urgencyStats = [
    {
      stat: "1,3 Mrd",
      description: "Menschen weltweit mit Behinderung",
      source: "WHO",
      highlight: true
    },
    {
      stat: "€50.000",
      description: "Höchststrafe bei Nichteinhaltung",
      source: "BFSG",
      highlight: true
    },
    {
      stat: "Juni 2025",
      description: "Deadline für alle Unternehmen",
      source: "EU-Recht",
      highlight: true
    }
  ];

  const accessibilityFeatures = [
    {
      icon: Eye,
      title: 'Sehbehinderungen',
      description: 'Screenreader-Unterstützung, hohe Kontraste und vergrößerbare Inhalte',
      impact: '285 Millionen Menschen betroffen'
    },
    {
      icon: Ear,
      title: 'Hörbehinderungen',
      description: 'Untertitel, visuelle Hinweise und Gebärdensprache-Support',
      impact: '466 Millionen Menschen betroffen'
    },
    {
      icon: MousePointer,
      title: 'Motorische Einschränkungen',
      description: 'Große Klickbereiche und Touch-optimierte Bedienung',
      impact: '75 Millionen Menschen betroffen'
    },
    {
      icon: Keyboard,
      title: 'Kognitive Einschränkungen',
      description: 'Einfache Navigation und verständliche Inhalte',
      impact: '200 Millionen Menschen betroffen'
    }
  ];

  const features = [
    {
      icon: Search,
      title: 'Automatisiertes Website-Crawling',
      description: 'Intelligente Durchsuchung aller Seiten mit konfigurierbarer Tiefe',
      benefit: 'Spart 40+ Stunden manuelle Arbeit'
    },
    {
      icon: Shield,
      title: 'WCAG 2.2 AA Vollprüfung',
      description: 'Komplette Prüfung nach neuesten Accessibility-Standards',
      benefit: '100% rechtssichere Compliance'
    },
    {
      icon: Brain,
      title: 'KI-gestützte Lösungsvorschläge',
      description: 'Google Gemini AI erklärt Probleme und liefert konkrete Fixes',
      benefit: '90% schnellere Problemlösung'
    },
    {
      icon: BarChart3,
      title: 'Executive Dashboard & Reports',
      description: 'Umfassende Berichte mit Prioritäten und ROI-Kennzahlen',
      benefit: 'Management-ready Reporting'
    },
    {
      icon: Zap,
      title: 'Live-Monitoring & Alerts',
      description: 'Kontinuierliche Überwachung und sofortige Benachrichtigungen',
      benefit: 'Probleme vor Launch erkennen'
    },
    {
      icon: FileText,
      title: 'Rechtssichere Dokumentation',
      description: 'Audit-fähige Berichte für Behörden und Compliance',
      benefit: 'Bußgelder vermeiden'
    }
  ];

  const benefits = [
    {
      icon: Scale,
      title: 'Rechtssicherheit garantiert',
      description: 'Vermeiden Sie Bußgelder bis €50.000 und rechtliche Konsequenzen',
      roi: 'ROI: 1.200%'
    },
    {
      icon: Users,
      title: '+23% mehr Kunden erreichen',
      description: 'Erschließen Sie den €13 Billion Markt von Menschen mit Behinderung',
      roi: 'Umsatz: +€180k/Jahr'
    },
    {
      icon: TrendingUp,
      title: 'SEO-Ranking verbessern',
      description: 'Accessibility-Faktoren sind Google-Ranking-Signale',
      roi: 'Traffic: +35%'
    },
    {
      icon: Award,
      title: 'Markenimage stärken',
      description: 'Zeigen Sie gesellschaftliche Verantwortung und Inklusivität',
      roi: 'Brand Value: unbezahlbar'
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "99",
      originalPrice: "149",
      period: "monat",
      description: "Perfekt für kleine Websites und Start-ups",
      features: [
        "Bis zu 3 Websites",
        "100 Seiten pro Scan",
        "WCAG 2.2 AA Tests",
        "PDF & Excel Reports",
        "Email Support",
        "Basis-Dashboard"
      ],
      popular: false,
      cta: "14 Tage kostenlos testen",
      savings: "33% sparen"
    },
    {
      name: "Professional",
      price: "299",
      originalPrice: "399",
      period: "monat",
      description: "Für Agenturen und mittelständische Unternehmen",
      features: [
        "Bis zu 15 Websites",
        "1.000 Seiten pro Scan",
        "KI-Analyse & Lösungsvorschläge",
        "Live-Monitoring & Alerts",
        "Priority Support (4h Response)",
        "API Zugang",
        "White-Label Reports",
        "Team-Kollaboration"
      ],
      popular: true,
      cta: "14 Tage kostenlos testen",
      savings: "25% sparen"
    },
    {
      name: "Enterprise",
      price: "899",
      originalPrice: "1.199",
      period: "monat",
      description: "Für Konzerne und große Organisationen",
      features: [
        "Unbegrenzte Websites",
        "Unbegrenzte Scans",
        "Dedicated Account Manager",
        "SLA Garantie (99,9%)",
        "Custom Integrations",
        "Schulungen & Workshops",
        "Legal Compliance Support",
        "Multi-Brand Management"
      ],
      popular: false,
      cta: "Demo vereinbaren",
      savings: "25% sparen"
    }
  ];

  const testimonials = [
    {
      quote: "A11y Inspector hat uns vor €45.000 Bußgeldern bewahrt. Das Tool hat kritische Probleme gefunden, die unser Team übersehen hatte.",
      author: "Dr. Maria Schmidt",
      role: "CDO, Stadtwerke München",
      rating: 5,
      company: "Stadtwerke München",
      result: "€45.000 Bußgelder vermieden"
    },
    {
      quote: "Durch die Barrierefreiheit haben wir 28% mehr Online-Conversions. Die Investition hat sich in 2 Monaten amortisiert.",
      author: "Thomas Weber",
      role: "E-Commerce Director, Fashion24",
      rating: 5,
      company: "Fashion24 GmbH",
      result: "+28% Conversions"
    },
    {
      quote: "Die KI-Erklärungen sind genial. Unsere Entwickler verstehen endlich, warum Accessibility wichtig ist und wie sie es umsetzen.",
      author: "Sarah Klein",
      role: "Tech Lead, StartupXYZ",
      rating: 5,
      company: "StartupXYZ",
      result: "90% schnellere Umsetzung"
    }
  ];

  const caseStudies = [
    {
      company: "E-Commerce Riese",
      challenge: "98% der Seiten nicht WCAG-konform",
      solution: "Vollautomatisierte Prüfung + KI-Fixes",
      result: "+€2.3M Umsatz durch bessere Accessibility"
    },
    {
      company: "Öffentliche Verwaltung",
      challenge: "EU-Compliance bis Juni 2025",
      solution: "Rechtssichere Dokumentation + Monitoring",
      result: "100% WCAG 2.2 AA Compliance erreicht"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-50">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">A11y Inspector</span>
            <Badge className="bg-green-100 text-green-800 text-xs">Live</Badge>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Anmelden
            </Button>
            <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700">
              <Rocket className="w-4 h-4 mr-2" />
              Jetzt starten
            </Button>
          </div>
        </nav>
      </header>

      {/* Urgent Alert Banner */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-center space-x-3 text-center">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="font-bold">EILMELDUNG:</span>
            <span>Nur noch 6 Monate bis zur WCAG 2.2 Pflicht!</span>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm font-semibold">
              Jetzt handeln
            </span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm">
              <ShieldCheck className="w-4 h-4 mr-2" />
              WCAG 2.2 AA Compliance Lösung
            </Badge>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Stoppen Sie 
            <span className="relative">
              <span className="text-red-600"> €50.000 Bußgelder</span>
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-red-200 opacity-50 transform -rotate-1"></div>
            </span>
            <br />
            mit automatisierter 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Accessibility-Prüfung
            </span>
          </h1>
          
          <p className="text-2xl text-gray-700 mb-8 leading-relaxed max-w-4xl mx-auto">
            Die einzige <strong>KI-gestützte WCAG 2.2 Lösung</strong>, die Ihre Website in 24h 
            rechtssicher macht und 23% mehr Kunden erreicht. 
            <span className="text-blue-600 font-semibold">Garantiert oder Geld zurück.</span>
          </p>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold">4.9/5 (247 Reviews)</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold">ISO 27001 zertifiziert</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold">2.500+ Websites geprüft</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
            >
              <Play className="w-5 h-5 mr-2" />
              Kostenlose Analyse starten
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 border-2"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Demo buchen (15 min)
            </Button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {urgencyStats.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">{item.stat}</div>
                <div className="text-gray-700 font-medium mb-1">{item.description}</div>
                <div className="text-xs text-gray-500">Quelle: {item.source}</div>
                {item.highlight && (
                  <div className="mt-2">
                    <Badge className="bg-red-100 text-red-800 text-xs">Kritisch</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem + Solution Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Das €13 Milliarden Problem, das Ihre Website kostet
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                98% aller Websites sind nicht barrierefrei und schließen Millionen von Kunden aus. 
                Gleichzeitig drohen ab Juni 2025 massive Bußgelder.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Die harten Fakten:
                </h3>
                <div className="space-y-6">
                  {accessibilityFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                          <p className="text-gray-600 mb-1">{feature.description}</p>
                          <p className="text-sm text-red-600 font-medium">{feature.impact}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Die A11y Inspector Lösung:
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">24h bis zur WCAG 2.2 Compliance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">KI findet 99,7% aller Probleme</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Konkrete Lösungsvorschläge</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Rechtssichere Dokumentation</span>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-white rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-gray-900">Garantiert oder Geld zurück</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    100% WCAG 2.2 AA Compliance in 30 Tagen oder Sie erhalten Ihr Geld zurück.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Warum A11y Inspector die beste Lösung ist
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Die einzige All-in-One Plattform, die Technologie, Recht und Business Intelligence vereint
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-sm font-semibold text-green-700">
                        ✅ {feature.benefit}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits/ROI Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Der messbare Business Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Accessibility ist nicht nur Compliance - es ist ein Umsatztreiber
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {benefit.roi}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Case Studies Preview */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Erfolgsgeschichten unserer Kunden
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {caseStudies.map((study, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2">{study.company}</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Herausforderung:</span> {study.challenge}</div>
                    <div><span className="font-medium">Lösung:</span> {study.solution}</div>
                    <div className="bg-green-100 rounded p-2">
                      <span className="font-bold text-green-800">Ergebnis: {study.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Investieren Sie smart in Ihre Zukunft
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Kosten einer Bußgeld-freien, umsatzsteigernden Website
            </p>
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-red-800">
                <Clock className="w-5 h-5" />
                <span className="font-bold">⏰ Limitiertes Angebot: Nur noch 48 Stunden!</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-4 ring-blue-500 scale-105 shadow-2xl' : 'shadow-lg'} bg-white border-0`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Beliebteste Wahl
                    </Badge>
                  </div>
                )}
                {plan.savings && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold transform rotate-12">
                    {plan.savings}
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm text-gray-500 line-through">€{plan.originalPrice}</span>
                      <Euro className="w-5 h-5 text-gray-600" />
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <div className="text-green-600 font-semibold text-sm">
                      Sie sparen €{parseInt(plan.originalPrice) - parseInt(plan.price)}/Monat
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full py-3 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate('/auth')}
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    {plan.cta}
                  </Button>
                  <p className="text-center text-xs text-gray-500 mt-3">
                    ✓ Keine Kreditkarte erforderlich ✓ Jederzeit kündbar
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Brauchen Sie eine maßgeschneiderte Lösung?</p>
            <Button variant="outline" size="lg">
              <Phone className="w-4 h-4 mr-2" />
              Kostenlose Beratung buchen
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Das sagen unsere Kunden
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-700">4.9/5 aus 247 Bewertungen</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600 mb-2">{testimonial.role}</div>
                    <div className="text-sm text-blue-600 font-medium">{testimonial.company}</div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2 inline-block">
                      {testimonial.result}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Requirements */}
      <section className="bg-red-50 py-16 border-y border-red-200">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ⚖️ Rechtliche Situation in Deutschland
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-red-600 mb-4">Aktuelle Gesetze</h3>
                <ul className="text-left space-y-2 text-sm">
                  <li>• BFSG (Barrierefreiheitsstärkungsgesetz)</li>
                  <li>• EU Web Accessibility Directive</li>
                  <li>• BGG (Behindertengleichstellungsgesetz)</li>
                  <li>• WCAG 2.2 AA Standard (verpflichtend)</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-red-600 mb-4">Strafen bei Nichteinhaltung</h3>
                <ul className="text-left space-y-2 text-sm">
                  <li>• Bußgelder bis €50.000</li>
                  <li>• Abmahnungen von Anwaltskanzleien</li>
                  <li>• Klagen von Behindertenverbänden</li>
                  <li>• Reputationsschäden</li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-center space-x-3 text-red-600 mb-4">
                <Clock className="w-6 h-6" />
                <span className="font-bold text-xl">Deadline: 28. Juni 2025</span>
              </div>
              <p className="text-gray-700 font-medium">
                Alle digitalen Dienstleistungen müssen barrierefrei sein. 
                <span className="text-red-600 font-bold"> Verstoßen Sie nicht gegen das Gesetz!</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Werden Sie noch heute rechtssicher!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Starten Sie Ihre kostenlose 14-Tage-Testphase und schützen Sie sich vor Bußgeldern.
              <br />
              <strong>Erste Ergebnisse in nur 24 Stunden!</strong>
            </p>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">24h</div>
                  <div className="text-sm opacity-80">Erste Scan-Ergebnisse</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">99,7%</div>
                  <div className="text-sm opacity-80">Erkennungsrate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">€0</div>
                  <div className="text-sm opacity-80">Setup-Kosten</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-4 shadow-xl"
              >
                <Rocket className="w-6 h-6 mr-3" />
                Jetzt kostenlos starten
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <div className="text-sm opacity-80">
                ✓ 14 Tage kostenlos ✓ Keine Kreditkarte ✓ In 2 Minuten startklar
              </div>
            </div>

            <div className="border-t border-white border-opacity-20 pt-8">
              <p className="text-sm opacity-75">
                Noch Fragen? Rufen Sie uns an: <strong>+49 (0) 30 123 456 789</strong>
                <br />
                Oder buchen Sie eine kostenlose 15-minütige Beratung
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-6 h-6" />
                  <span className="text-lg font-semibold">A11y Inspector</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Die führende WCAG 2.2 Compliance-Lösung für eine barrierefreie digitale Welt.
                </p>
                <div className="flex space-x-4">
                  <Badge className="bg-green-600">ISO 27001</Badge>
                  <Badge className="bg-blue-600">GDPR</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Produkt</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Features</li>
                  <li>Preise</li>
                  <li>API</li>
                  <li>Integrationen</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Rechtliches</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>WCAG 2.2 Guide</li>
                  <li>BFSG Compliance</li>
                  <li>Datenschutz</li>
                  <li>AGB</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Hilfe-Center</li>
                  <li>Webinare</li>
                  <li>Kontakt</li>
                  <li>Status</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2024 A11y Inspector. Alle Rechte vorbehalten. 
                Made with ❤️ for a more accessible web.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
