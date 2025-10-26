import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Alert, AlertDescription } from './ui/alert';
import { Users, TrendingUp, Award, CheckCircle2, Smartphone, GraduationCap, ArrowRight, LogIn, Info } from 'lucide-react';
import { useAuth } from './AuthContext';

interface HubManagerPageProps {
  onNavigate: (page: string) => void;
}

export function HubManagerPage({ onNavigate }: HubManagerPageProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-white">Become a Hub Manager: Lead Your Community's Health Transformation</h1>
            <p className="text-xl text-blue-50">
              Join Elder Adjei and trusted leaders managing Sankofa Hubs across Ghana
            </p>
          </div>
        </div>
      </section>

      {/* Login Alert for Existing Managers */}
      {!isAuthenticated && (
        <section className="py-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200">
          <div className="container mx-auto px-4">
            <Alert className="max-w-4xl mx-auto border-2 border-blue-300 bg-white">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription className="ml-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-blue-900">
                      <strong>Already a Hub Manager?</strong> Sign in to access your management dashboard and hub analytics.
                    </p>
                  </div>
                  <Button
                    onClick={() => onNavigate('login')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 shrink-0"
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

      {/* What is a Hub Manager */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="mb-4 text-gray-900">Who is a Hub Manager?</h2>
              <p className="text-lg text-gray-700 mb-6">
                Hub Managers are trusted community leaders like Elder Adjei who serve as the local face of Sankofa. They manage collection points, process transactions, and help Collectors succeed.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Community Leader</h4>
                    <p className="text-sm text-gray-600">Respected member who connects with local Collectors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Transaction Manager</h4>
                    <p className="text-sm text-gray-600">Weighs plastic, processes payments, and maintains records</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Health Advocate</h4>
                    <p className="text-sm text-gray-600">Educates community about healthcare benefits and NHIS access</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1559154352-06e29e1e11aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBsZWFkZXIlMjBhZnJpY2F8ZW58MXx8fHwxNzYxMzc2MTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Community leader"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-gray-900">Benefits of Being a Hub Manager</h2>
            <p className="text-lg text-gray-600">
              Earn income while making a lasting impact in your community
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="p-8 bg-white border-2 border-blue-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-6">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-gray-900">Steady Income</h3>
              <p className="text-gray-600 mb-4">
                Earn a consistent monthly stipend plus transaction-based bonuses
              </p>
              <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                Average earnings: GH₵800-1,500/month
              </div>
            </Card>

            <Card className="p-8 bg-white border-2 border-blue-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mb-6">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-gray-900">Community Leadership</h3>
              <p className="text-gray-600 mb-4">
                Enhance your standing as a trusted leader driving positive change
              </p>
              <div className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                Recognition & respect from your community
              </div>
            </Card>

            <Card className="p-8 bg-white border-2 border-blue-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 mb-6">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-gray-900">Training & Support</h3>
              <p className="text-gray-600 mb-4">
                Receive comprehensive training and ongoing technical support
              </p>
              <div className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
                Digital skills & business management
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-gray-900">Hub Manager Requirements</h2>
              <p className="text-lg text-gray-600">
                What you need to become a Hub Manager
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 border-2 border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-gray-900">Community Standing</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Trusted member of your community</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Strong interpersonal skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Commitment to community health</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-gray-900">Technical Requirements</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Access to a smartphone (provided if needed)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Basic digital literacy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Reliable internet access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-gray-900">Personal Qualities</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Honest and trustworthy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Good organizational skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Ability to keep records</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-gray-900">Availability</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Minimum 20 hours per week</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Flexible schedule to serve community</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                        <span>Long-term commitment (1+ years)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-gray-900">How to Become a Hub Manager</h2>
            <p className="text-lg text-gray-600">Three simple steps to join our team</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mb-12">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-6 mx-auto">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="mb-3 text-gray-900">Review Criteria</h3>
              <p className="text-gray-600">
                Ensure you meet the requirements and understand the responsibilities
              </p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-6 mx-auto">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="mb-3 text-gray-900">Apply Online</h3>
              <p className="text-gray-600">
                Complete our application form with your information and community references
              </p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-6 mx-auto">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="mb-3 text-gray-900">Complete Training</h3>
              <p className="text-gray-600">
                Attend our comprehensive training program and receive your Hub setup
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => onNavigate('contact')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 gap-2"
            >
              <Award className="h-5 w-5" />
              Apply Now to Be a Hub Manager
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              Applications reviewed within 5-7 business days
            </p>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-2xl">
                    EA
                  </div>
                </div>
                <h3 className="text-gray-900 mb-2">Elder Adjei's Story</h3>
                <p className="text-sm text-blue-700">Hub Manager, Accra Central</p>
              </div>
              <blockquote className="text-center text-gray-700 italic mb-6">
                "Becoming a Hub Manager transformed not just my income, but my entire community. I've helped over 200 families gain NHIS access, and our neighborhood is cleaner and healthier. It's more than a job—it's a calling to serve."
              </blockquote>
              <div className="text-center text-sm text-gray-600">
                <strong>Impact:</strong> 85 tons plastic collected • 217 people with NHIS • 18 months as Hub Manager
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
