import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Alert, AlertDescription } from './ui/alert';
import { Wallet, Shield, MapPin, Smartphone, Phone, ArrowRight, LogIn, Info } from 'lucide-react';
import { useAuth } from './AuthContext';

interface CollectorPageProps {
  onNavigate: (page: string) => void;
}

export function CollectorPage({ onNavigate }: CollectorPageProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-[#08A26F] text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-white">Become a Collector: Turn Plastic into Health & Cash</h1>
            <p className="text-xl text-emerald-50">
              Join Ama and thousands of collectors earning money while protecting your community's health
            </p>
          </div>
        </div>
      </section>

      {/* Login Alert for New Users */}
      {!isAuthenticated && (
        <section className="py-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200">
          <div className="container mx-auto px-4">
            <Alert className="max-w-4xl mx-auto border-2 border-amber-300 bg-white">
              <Info className="h-5 w-5 text-amber-600" />
              <AlertDescription className="ml-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-amber-900">
                      <strong>Already a Collector?</strong> Sign in to access your dashboard, track earnings, and view your health impact.
                    </p>
                  </div>
                  <Button
                    onClick={() => onNavigate('login')}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2 shrink-0"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </section>
      )}

      {/* What is a Collector */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 items-center max-w-6xl mx-auto">
            <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1756362399416-503694e40cf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwcmVjeWNsaW5nJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NjEzNzYxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Plastic collection"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="mb-4 text-gray-900">Who is a Collector?</h2>
              <p className="text-lg text-gray-700 mb-4">
                Collectors are everyday Ghanaians like Ama who gather plastic waste from their communities and bring it to local Sankofa Hubs.
              </p>
              <p className="text-gray-600">
                No special equipment needed. No prior experience required. Just bring your collected plastic to your nearest Hub and start earning while making your community cleaner and healthier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Reward Split */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-gray-900">Your Dual Reward Split</h2>
            <p className="text-lg text-gray-600">
              Every kilogram of plastic you collect earns you money and healthcare protection
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {/* 70% Cash */}
            <Card className="p-8 border-2 border-emerald-200 bg-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600">
                  <Wallet className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="mb-2 text-emerald-700">70% INSTANT CASH</div>
                  <h3 className="text-gray-900">Meet Your Daily Needs</h3>
                </div>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span>Receive 70% of your earnings immediately as cash</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span>Use it for food, transport, school fees, or any daily expense</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span>Paid directly at your local Hub — no bank account needed</span>
                </li>
              </ul>
            </Card>

            {/* 30% Health Tokens */}
            <Card className="p-8 border-2 border-blue-200 bg-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="mb-2 text-blue-700">30% SAVINGS TOKENS</div>
                  <h3 className="text-gray-900">Fund Your Healthcare</h3>
                </div>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>30% automatically saved as Sankofa Health Tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Use tokens to enroll or renew your NHIS (National Health Insurance)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Build healthcare security for you and your family</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="mt-12 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-500">
            <p className="text-gray-700">
              <strong className="text-emerald-700">Example:</strong> Collect 10kg of plastic at GH₵2/kg = GH₵20 total. You receive <strong>GH₵14 cash</strong> immediately and <strong>GH₵6 in Health Tokens</strong> saved for your NHIS.
            </p>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-gray-900">How to Get Started</h2>
            <p className="text-lg text-gray-600">Three simple steps to start earning</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-6 mx-auto">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="mb-3 text-gray-900">Find Your Hub</h3>
              <p className="text-gray-600">
                Locate your nearest Sankofa Hub using our map or ask your community leader
              </p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-6 mx-auto">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="mb-3 text-gray-900">Gather Plastic</h3>
              <p className="text-gray-600">
                Collect plastic bottles, bags, and containers from your home and neighborhood
              </p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-6 mx-auto">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="mb-3 text-gray-900">Get Paid & Save</h3>
              <p className="text-gray-600">
                Bring your plastic to the Hub, get your cash, and automatically save for healthcare
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Low-Tech Solution - USSD/SMS */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-orange-50 to-amber-50 border-y-4 border-orange-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <Phone className="h-12 w-12 text-orange-600" />
              </div>
              <h2 className="mb-4 text-gray-900">No Smartphone? No Problem!</h2>
              <p className="text-xl text-gray-700">
                Access Sankofa on any feature phone using USSD or SMS
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mb-10">
              <Card className="p-8 bg-white border-2 border-orange-200">
                <h3 className="mb-4 text-gray-900 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-orange-600" />
                  USSD Access
                </h3>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Simply dial on your phone:</p>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-xl text-center">
                    <div className="text-3xl mb-2">*800*726563#</div>
                    <div className="text-sm text-orange-100">*800*SANKOFA#</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-orange-600" />
                    </div>
                    <span>Check your balance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-orange-600" />
                    </div>
                    <span>Find nearest Hub location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-orange-600" />
                    </div>
                    <span>View your Health Token savings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-orange-600" />
                    </div>
                    <span>Request NHIS assistance</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 bg-white border-2 border-orange-200">
                <h3 className="mb-4 text-gray-900 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-orange-600" />
                  SMS Access
                </h3>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Send an SMS to:</p>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-xl text-center mb-4">
                    <div className="text-3xl">2626</div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">Available commands:</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-orange-600" />
                    </div>
                    <span><strong>BAL</strong> - Check balance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-orange-600" />
                    </div>
                    <span><strong>HUB</strong> - Find nearest Hub</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-orange-600" />
                    </div>
                    <span><strong>HEALTH</strong> - View Health Tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-orange-600" />
                    </div>
                    <span><strong>HELP</strong> - Get assistance</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-orange-300">
              <p className="text-center text-gray-700">
                <strong className="text-orange-700">Everyone can participate!</strong> Whether you have a smartphone, feature phone, or basic mobile, you can be part of Sankofa and earn rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Find Hub CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-gray-900">Ready to Start Collecting?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Find your nearest Sankofa Hub and start earning today
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('contact')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2"
          >
            <MapPin className="h-5 w-5" />
            Find Your Nearest Hub
          </Button>
        </div>
      </section>
    </div>
  );
}
