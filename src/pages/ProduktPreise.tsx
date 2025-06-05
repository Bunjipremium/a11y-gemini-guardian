
import { Check, Star, Zap, Building, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const ProduktPreise = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      price: '49',
      period: 'pro Monat',
      description: 'Perfekt für kleine Websites und Einzelunternehmer',
      features: [
        'Bis zu 3 Websites',
        'Bis zu 100 Seiten pro Website',
        'Monatliche Scans',
        'WCAG 2.2 AA Compliance Check',
        'PDF-Berichte',
        'E-Mail Support',
        '14 Tage kostenlos testen'
      ],
      popular: false,
      buttonText: 'Jetzt starten',
      savings: null
    },
    {
      name: 'Professional',
      icon: Building,
      price: '149',
      period: 'pro Monat',
      description: 'Ideal für mittelständische Unternehmen und Agenturen',
      features: [
        'Bis zu 10 Websites',
        'Bis zu 1.000 Seiten pro Website',
        'Wöchentliche Scans',
        'WCAG 2.2 AA & AAA Compliance',
        'Detaillierte PDF & Excel Reports',
        'API-Zugang',
        'Team-Collaboration (5 Nutzer)',
        'Priority Support',
        'Custom Branding',
        '14 Tage kostenlos testen'
      ],
      popular: true,
      buttonText: 'Professional wählen',
      savings: 'Spare 20% jährlich'
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: '399',
      period: 'pro Monat',
      description: 'Für große Unternehmen mit höchsten Anforderungen',
      features: [
        'Unbegrenzt Websites',
        'Unbegrenzt Seiten',
        'Tägliche Scans',
        'Alle WCAG Standards',
        'White-Label Lösung',
        'Dedicated API',
        'Unbegrenzt Team-Nutzer',
        'SLA & 24/7 Support',
        'Custom Integrations',
        'On-Premise Option',
        'Persönlicher Account Manager',
        '30 Tage kostenlos testen'
      ],
      popular: false,
      buttonText: 'Enterprise kontaktieren',
      savings: 'Individuelle Konditionen'
    }
  ];

  const faqs = [
    {
      question: 'Kann ich jederzeit kündigen?',
      answer: 'Ja, Sie können Ihr Abonnement jederzeit mit einer Frist von 30 Tagen kündigen. Es gibt keine versteckten Kosten oder Bindungen.'
    },
    {
      question: 'Was passiert nach der kostenlosen Testphase?',
      answer: 'Nach der Testphase können Sie entscheiden, ob Sie ein kostenpflichtiges Abonnement abschließen möchten. Ohne Abonnement läuft Ihr Zugang automatisch aus.'
    },
    {
      question: 'Sind Updates im Preis enthalten?',
      answer: 'Ja, alle Updates und neue Features sind in Ihrem Abonnement enthalten. Sie erhalten automatisch Zugang zu neuen WCAG-Standards und Funktionen.'
    },
    {
      question: 'Bieten Sie Mengenrabatte an?',
      answer: 'Ja, für größere Teams und Enterprise-Kunden bieten wir individuelle Konditionen. Kontaktieren Sie uns für ein maßgeschneidertes Angebot.'
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
                Transparente Preise
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Wählen Sie den Plan, der zu
                <span className="text-blue-600"> Ihnen passt</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Alle Pläne beinhalten vollständige WCAG 2.2-Compliance-Prüfung. 
                Keine versteckten Kosten, keine Einrichtungsgebühren.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                    plan.popular 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">
                        <Star className="w-4 h-4 mr-1" />
                        Beliebtester Plan
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
                        <span className="text-gray-600 ml-2">/{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <p className="text-sm text-green-600 mt-2 font-medium">{plan.savings}</p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-6">
                      <Button 
                        className={`w-full py-3 text-lg font-semibold ${
                          plan.popular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                        onClick={() => navigate('/auth')}
                      >
                        {plan.buttonText}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Häufig gestellte Fragen
              </h2>
              <p className="text-xl text-gray-600">
                Haben Sie weitere Fragen? Kontaktieren Sie uns gerne.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
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
              Noch unsicher? Testen Sie uns kostenlos!
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Starten Sie noch heute mit Ihrer kostenlosen Testphase und 
              überzeugen Sie sich von der Qualität unserer Lösung.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/auth')}
            >
              14 Tage kostenlos testen
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProduktPreise;
