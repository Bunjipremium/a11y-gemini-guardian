
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
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const urgencyStats = [
    {
      stat: "15%",
      description: "der Weltbevölkerung leben mit einer Behinderung",
      source: "WHO"
    },
    {
      stat: "€12.000",
      description: "Durchschnittliche Bußgelder bei Nichteinhaltung",
      source: "BFSG"
    },
    {
      stat: "2025",
      description: "Pflicht für alle öffentlichen Stellen in Deutschland",
      source: "Gesetz"
    }
  ];

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
      icon: Scale,
      title: 'Rechtssicherheit',
      description: 'Erfüllen Sie gesetzliche Anforderungen und vermeiden Sie Bußgelder'
    },
    {
      icon: Users,
      title: 'Mehr Reichweite',
      description: '15% mehr potenzielle Nutzer durch barrierefreie Websites'
    },
    {
      icon: TrendingUp,
      title: 'Bessere SEO',
      description: 'Accessibility verbessert automatisch Ihre Suchmaschinen-Rankings'
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "29",
      period: "monat",
      description: "Perfekt für kleine Websites und Freelancer",
      features: [
        "Bis zu 5 Websites",
        "50 Seiten pro Scan",
        "WCAG 2.2 AA Tests",
        "PDF Reports",
        "Email Support"
      ],
      popular: false,
      cta: "Kostenlos testen"
    },
    {
      name: "Professional",
      price: "89",
      period: "monat",
      description: "Für Agenturen und mittelständische Unternehmen",
      features: [
        "Bis zu 25 Websites",
        "500 Seiten pro Scan",
        "KI-Analyse & Lösungsvorschläge",
        "Priority Support",
        "API Zugang",
        "White-Label Reports"
      ],
      popular: true,
      cta: "14 Tage kostenlos"
    },
    {
      name: "Enterprise",
      price: "299",
      period: "monat",
      description: "Für große Organisationen und Konzerne",
      features: [
        "Unbegrenzte Websites",
        "Unbegrenzte Scans",
        "Dedicated Account Manager",
        "SLA Garantie",
        "Custom Integrations",
        "Schulungen & Workshops"
      ],
      popular: false,
      cta: "Kontakt aufnehmen"
    }
  ];

  const testimonials = [
    {
      quote: "A11y Inspector hat uns geholfen, alle WCAG-Anforderungen zu erfüllen und Bußgelder zu vermeiden.",
      author: "Maria Schmidt",
      role: "IT-Leiterin, Stadtwerke München",
      rating: 5
    },
    {
      quote: "Endlich ein Tool, das nicht nur Probleme findet, sondern auch konkrete Lösungen vorschlägt.",
      author: "Thomas Weber",
      role: "Web Developer, Digital Agentur",
      rating: 5
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

      {/* Urgency Banner */}
      <section className="bg-red-50 border-y border-red-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Wichtig:</span>
            <span>Ab 2025 sind alle öffentlichen Stellen zur WCAG 2.2 AA Compliance verpflichtet</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-blue-100 text-blue-800">
            WCAG 2.2 AA Compliance
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Vermeiden Sie 
            <span className="text-red-600"> Bußgelder</span> durch
            <span className="text-blue-600"> automatisierte Accessibility-Prüfung</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professionelle WCAG 2.2 AA Compliance-Prüfung mit KI-gestützten 
            Erklärungen. Erfüllen Sie gesetzliche Anforderungen und erreichen Sie 15% mehr Nutzer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <span>Kostenlos testen</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              Demo ansehen
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {urgencyStats.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{item.stat}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
                <div className="text-xs text-gray-500 mt-1">Quelle: {item.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Das Problem: Millionen ausgeschlossener Nutzer
            </h2>
            <p className="text-lg text-gray-600">
              Websites ohne Barrierefreiheit schließen 15% der Bevölkerung aus und verstoßen gegen geltendes Recht
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-red-600" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
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

      {/* Pricing Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transparente Preise für jeden Bedarf
            </h2>
            <p className="text-lg text-gray-600">
              Wählen Sie das passende Paket für Ihre Anforderungen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Beliebteste Wahl
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-center justify-center space-x-1">
                    <Euro className="w-5 h-5 text-gray-600" />
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate('/auth')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Was unsere Kunden sagen
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Legal Requirements */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gesetzliche Anforderungen erfüllen
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Das Barrierefreiheitsstärkungsgesetz (BFSG) und die WCAG 2.2 machen 
              Accessibility zur Pflicht - nicht zur Option.
            </p>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Deadline: 28. Juni 2025</span>
              </div>
              <p className="text-gray-700">
                Alle digitalen Dienstleistungen müssen bis zu diesem Datum 
                barrierefrei gestaltet sein. Verstöße können mit hohen Bußgeldern bestraft werden.
              </p>
            </div>
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
            className="flex items-center space-x-2 mx-auto bg-blue-600 hover:bg-blue-700"
          >
            <span>Jetzt kostenlos starten</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            ✓ 14 Tage kostenlos ✓ Keine Kreditkarte erforderlich ✓ Sofortiger Zugang
          </p>
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
