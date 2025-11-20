// Placeholder for Figma assets - replace with actual image paths
const image_15ba8a23904bc1184277cb01f37b6aef977c5a2e = '';
const image_dc7f25e3db216185fae7dce2766fc87b567ad49d = '';
const image_5dd478784fce2322af8e4a74bd6b6f640b1c1546 = '';
const image_c089a3030ed6e72076e4ae4c401a18453e8a4af1 = '';
const image_2e7ba955919ab5a485f16b7a23bc1066ffadc465 = '';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { EducationalResources } from './EducationalResources';
import { SeeAndReportPopup } from './SeeAndReportPopup';
import { Heart, Target, Eye, Users, CheckCircle2, ArrowRight, Recycle, TrendingUp, MapPin, Shield } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const teamMembers = [
    {
      name: 'Neequaye Kotey',
      role: 'Product Designer & Group Lead',
      expertise: 'User experience design, product strategy, team leadership',
      image: image_2e7ba955919ab5a485f16b7a23bc1066ffadc465,
    },
    {
      name: 'Osie Revic Owusu',
      role: 'Tech Lead',
      expertise: 'Software architecture, AI/ML systems, technical innovation',
      image: image_c089a3030ed6e72076e4ae4c401a18453e8a4af1,
    },
    {
      name: 'Jescaps Antwi',
      role: 'Policy Analyst',
      expertise: 'Healthcare policy, regulatory strategy, data analysis',
      image: image_5dd478784fce2322af8e4a74bd6b6f640b1c1546,
    },
    {
      name: 'Janet Chepkirui',
      role: 'Lead Strategist',
      expertise: 'Strategic planning, business development, stakeholder engagement',
      image: image_dc7f25e3db216185fae7dce2766fc87b567ad49d,
    },
    {
      name: 'Gideon Nyarko',
      role: 'Data Analyst',
      expertise: 'Data analysis, predictive modeling, research methodology',
      image: image_15ba8a23904bc1184277cb01f37b6aef977c5a2e,
    },
  ];

  return (
    <div className="w-full">
      <SeeAndReportPopup onNavigate={onNavigate} />
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1614850715649-1d0106293bd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaGFuYSUyMGNvbW11bml0eSUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzYxNDk2NzExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Community collaboration in Ghana"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-white"></div>
                <span className="text-sm text-white">Our Story</span>
              </div>
              <h1 className="text-5xl md:text-6xl mb-6 text-white leading-tight">
                About Sankofa-Coin
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Building a healthier Ghana by transforming waste into wellness, one community at a time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do - Reference Design Style */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl text-gray-900 mb-4">
                  Transforming plastic waste into health protection
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We connect environmental action to predictive health intelligence, providing Ghanaian communities with the tools they need to prevent disease and access healthcare.
                </p>
                <button
                  onClick={() => onNavigate("contact")}
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Get Involved
                  <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-gray-900" />
                  </div>
                </button>
              </div>

              {/* Right Grid - Core Services */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
                      <Recycle className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900">
                      Plastic Collection
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                      Community-driven recycling
                    </p>
                  </div>
                </Card>

                <Card className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
                      <TrendingUp className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900">
                      Health Intelligence
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                      AI-powered insights
                    </p>
                  </div>
                </Card>

                <Card className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
                      <Heart className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900">
                      NHIS Funding
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                      Healthcare access
                    </p>
                  </div>
                </Card>

                <Card className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
                      <Users className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900">
                      Community Network
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                      8,652 active members
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Sankofa */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <img 
                src="/components/images/logo.png" 
                alt="Sankofa-Coin Logo"
                className="h-24 w-24 mx-auto object-contain mb-6"
              />
              <h2 className="text-4xl text-gray-900 mb-4">What is Sankofa?</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mb-16">
              <Card className="bg-gradient-to-br from-[#FBBF24]/10 to-[#f97316]/10 border border-[#FBBF24]/20 rounded-3xl p-10">
                <h3 className="text-2xl text-gray-900 mb-4">The Cultural Symbol</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  The Sankofa bird is a powerful Adinkra symbol from the Akan people of Ghana. It depicts a mythical bird flying forward while looking backward, with an egg in its mouth.
                </p>
                <div className="bg-white rounded-2xl p-6 border border-[#FBBF24]/20">
                  <p className="text-center text-lg text-[#FBBF24] mb-2">
                    "Se wo were fi na wosankofa a yenkyi"
                  </p>
                  <p className="text-center text-sm text-gray-700">
                    "It is not wrong to go back for that which you have forgotten"
                  </p>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-[#10b981]/10 to-[#14b8a6]/10 border border-[#10b981]/20 rounded-3xl p-10">
                <h3 className="text-2xl text-gray-900 mb-4">Our Interpretation</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Just as the Sankofa bird looks back to move forward, we reclaim discarded plastic to build a healthier future. We learn from our past environmental challenges to create innovative solutions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#10b981] shrink-0 mt-0.5" />
                    <span className="text-gray-700">Reclaim waste for health intelligence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#10b981] shrink-0 mt-0.5" />
                    <span className="text-gray-700">Honor traditional wisdom with modern tech</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#10b981] shrink-0 mt-0.5" />
                    <span className="text-gray-700">Build from community strengths</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values - Reference Design Style */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl text-gray-900 mb-4">
                  Our mission, vision, and core values
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We're guided by a commitment to community empowerment, transparency, innovation, cultural respect, and equitable access to health protection for all Ghanaians.
                </p>
                <button
                  onClick={() => onNavigate("volunteer")}
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Join Our Team
                  <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-gray-900" />
                  </div>
                </button>
              </div>

              {/* Right Grid - Mission/Vision/Values */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
                      <Target className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900 mb-2">
                      Mission
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Transform pollution into health intelligence
                    </p>
                  </div>
                </Card>

                <Card className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
                      <Eye className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900 mb-2">
                      Vision
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Seamless connection of environment and health
                    </p>
                  </div>
                </Card>

                <Card className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
                      <Heart className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900 mb-2">
                      Values
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Community, transparency, innovation
                    </p>
                  </div>
                </Card>

                <Card className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center mb-4">
                      <Shield className="h-7 w-7 text-gray-900" />
                    </div>
                    <h3 className="text-sm text-gray-900 mb-2">
                      Commitment
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Equitable healthcare access for all
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 mb-3">Our Team</h2>
              <p className="text-gray-600">
                Passionate leaders dedicated to Ghana's health and environmental future
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {teamMembers.map((member) => (
                <div key={member.name} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-stone-100">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-[#08A26F]">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Story */}
      <section className="py-20 bg-gradient-to-br from-[#10b981]/5 to-[#3b82f6]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-4xl text-gray-900 mb-6">Our Impact Story</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl text-gray-900 mb-3">2019 - The Beginning</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Started with 5 collection Hubs in Accra, partnering with local communities to pilot our Dual Reward Split model
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl text-gray-900 mb-3">2021 - AI Integration</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Launched our predictive health intelligence platform, analyzing plastic collection patterns to identify disease risk zones
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl text-gray-900 mb-3">2023 - National Expansion</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Expanded to 47 Hubs across Ghana with 12,430 Ghanaians enrolled in NHIS through our program
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="text-3xl text-[#10b981] mb-2">2,847</div>
                  <div className="text-sm text-gray-600">Tons Plastic Recycled</div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="text-3xl text-[#3b82f6] mb-2">12.4K</div>
                  <div className="text-sm text-gray-600">NHIS Enrollments</div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="text-3xl text-[#FBBF24] mb-2">GH₵1.2M</div>
                  <div className="text-sm text-gray-600">Into Healthcare</div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="text-3xl text-[#f97316] mb-2">8,652</div>
                  <div className="text-sm text-gray-600">Active Collectors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Resources */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <EducationalResources onNavigate={onNavigate} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl mb-6">Join Our Mission</h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Be part of the movement transforming Ghana's environmental and health future
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onNavigate('collector')}
                className="bg-[#10b981] hover:bg-[#059669] text-white px-8 py-4 rounded-full inline-flex items-center gap-2 transition-colors"
              >
                Become a Collector
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('hub-manager')}
                className="border-2 border-white text-white hover:bg-white hover:text-[#1a1a1a] px-8 py-4 rounded-full inline-flex items-center gap-2 transition-colors"
              >
                Become a Hub Manager
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
