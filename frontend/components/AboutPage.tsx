import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { EducationalResources } from './EducationalResources';
import { Heart, Target, Eye, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const teamMembers = [
    {
      name: 'Dr. Ama Osei',
      role: 'Policy Analyst & Co-Founder',
      expertise: 'Public health policy, healthcare access, community engagement',
      image: 'https://images.unsplash.com/photo-1669042680035-216cefe17428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHaGFuYSUyMGNvbW11bml0eSUyMHBlb3BsZXxlbnwxfHx8fDE3NjEzNzYxMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Kwame Mensah',
      role: 'Tech Lead & Co-Founder',
      expertise: 'AI/ML, blockchain systems, mobile technology',
      image: 'https://images.unsplash.com/photo-1559154352-06e29e1e11aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBsZWFkZXIlMjBhZnJpY2F8ZW58MXx8fHwxNzYxMzc2MTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Efua Asante',
      role: 'Community Engagement Director',
      expertise: 'Grassroots organizing, Hub network management, USSD/SMS systems',
      image: 'https://images.unsplash.com/photo-1694286068362-5dcea7ed282a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwYWZyaWNhfGVufDF8fHx8MTc2MTM3NjExMXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#10b981] to-[#14b8a6] text-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <span className="text-sm">Our Story</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 text-white leading-tight">
              About Sankofa-Coin
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Building a healthier Ghana by transforming waste into wellness, one community at a time
            </p>
          </div>
        </div>
      </section>

      {/* What is Sankofa */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-6xl mb-6">ðŸ¦</div>
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

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="bg-white border-0 shadow-sm rounded-3xl p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10b981]/10 mx-auto mb-6">
                  <Target className="h-8 w-8 text-[#10b981]" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-4">Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  Transform plastic pollution into predictive health intelligence and affordable healthcare access for every Ghanaian through community-driven action
                </p>
              </Card>

              <Card className="bg-white border-0 shadow-sm rounded-3xl p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3b82f6]/10 mx-auto mb-6">
                  <Eye className="h-8 w-8 text-[#3b82f6]" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-4">Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  A Ghana where environmental action and health protection are seamlessly connected, and every community has the tools to prevent disease
                </p>
              </Card>

              <Card className="bg-white border-0 shadow-sm rounded-3xl p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FBBF24]/10 mx-auto mb-6">
                  <Heart className="h-8 w-8 text-[#FBBF24]" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-4">Values</h3>
                <p className="text-gray-600 leading-relaxed">
                  Community empowerment, transparency, innovation, cultural respect, and equitable access to health protection for all
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-600">
                Passionate leaders dedicated to Ghana's health and environmental future
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {teamMembers.map((member) => (
                <Card key={member.name} className="bg-white border-0 shadow-sm rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-[#10b981] mb-3">{member.role}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{member.expertise}</p>
                  </div>
                </Card>
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
                  <div className="text-3xl text-[#FBBF24] mb-2">GHâ‚µ1.2M</div>
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
                className="border border-white text-white hover:bg-white hover:text-[#1a1a1a] px-8 py-4 rounded-full inline-flex items-center gap-2 transition-colors"
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
