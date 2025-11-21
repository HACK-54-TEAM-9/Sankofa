import { useState } from 'react';
import { Heart, Users, BookOpen, MapPin, Clock, CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface VolunteerPageProps {
  onNavigate?: (page: string) => void;
}

export function VolunteerPage({ onNavigate }: VolunteerPageProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    availability: '',
    skills: '',
    message: ''
  });

  const opportunities = [
    {
      id: 'community-cleanup',
      title: 'Community Cleanup Coordinator',
      location: 'Various locations across Ghana',
      time: '10-15 hours/week',
      icon: Users,
      color: 'bg-[#10b981]',
      description: 'Lead community cleanup events and educate residents about proper plastic disposal.',
      requirements: ['Good communication skills', 'Community leadership experience', 'Available on weekends']
    },
    {
      id: 'health-educator',
      title: 'Health Education Ambassador',
      location: 'Accra, Kumasi, Tamale',
      time: '5-10 hours/week',
      icon: BookOpen,
      color: 'bg-[#3b82f6]',
      description: 'Teach communities about the health impacts of plastic pollution and preventive measures.',
      requirements: ['Public speaking ability', 'Health or education background helpful', 'Fluent in local languages']
    },
    {
      id: 'hub-assistant',
      title: 'Collection Hub Assistant',
      location: 'Hub locations nationwide',
      time: '15-20 hours/week',
      icon: MapPin,
      color: 'bg-[#FBBF24]',
      description: 'Support hub operations, assist collectors, and manage plastic sorting and weighing.',
      requirements: ['Organized and detail-oriented', 'Basic computer skills', 'Physical stamina for handling materials']
    },
    {
      id: 'data-volunteer',
      title: 'Data & Impact Analyst',
      location: 'Remote',
      time: '5-8 hours/week',
      icon: Calendar,
      color: 'bg-[#8b5cf6]',
      description: 'Help analyze collection data, track health metrics, and create impact reports.',
      requirements: ['Data analysis skills', 'Excel/Google Sheets proficiency', 'Attention to detail']
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate form submission
    toast.success('Application submitted! We\'ll contact you within 48 hours.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      availability: '',
      skills: '',
      message: ''
    });
    setSelectedOpportunity(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1661335910769-793adfc7870e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwY2xlYW5pbmclMjBjb21tdW5pdHklMjBhZnJpY2F8ZW58MXx8fHwxNzYxNTQ4NzU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Volunteers cleaning community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/90 bg-[rgba(9,23,14,0.9)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 px-4 py-2 rounded-full mb-6">
              <Heart className="h-4 w-4 text-[#10b981]" />
              <span className="text-sm text-[rgb(255,255,255)]">Make a Difference</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl text-[rgb(255,255,255)] mb-6 font-bold">
              Volunteer with <span className="text-[#10b981]">Sankofa-Coin</span>
            </h1>
            
            <p className="text-xl text-[rgba(211,212,213,0.79)] mb-8 leading-relaxed">
              Join our mission to transform Ghana's health through environmental action. 
              Your time and skills can create lasting change in communities across the nation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl text-[rgb(255,255,255)] mb-2 font-bold">500+</div>
                <div className="text-sm text-[rgba(208,208,208,0.7)]">Active Volunteers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-[rgb(255,255,255)] mb-2 font-bold">15,000+</div>
                <div className="text-sm text-[rgba(255,255,255,0.7)]">Hours Contributed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-[rgb(255,255,255)] mb-2 font-bold">89</div>
                <div className="text-sm text-[rgba(255,255,255,0.7)]">Communities Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4 font-bold">
                Current Opportunities
              </h2>
              <p className="text-lg text-gray-600">
                Find the perfect way to contribute your time and talent
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-16">
              {opportunities.map((opportunity) => {
                const Icon = opportunity.icon;
                return (
                  <Card
                    key={opportunity.id}
                    className={`border-0 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-lg transition-all cursor-pointer ${
                      selectedOpportunity === opportunity.id ? 'ring-2 ring-[#10b981]' : ''
                    }`}
                    onClick={() => setSelectedOpportunity(opportunity.id)}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${opportunity.color}/10 mb-4`}>
                      <Icon className={`h-6 w-6 text-gray-900`} style={{ color: opportunity.color.replace('bg-', '').replace('[', '').replace(']', '') }} />
                    </div>
                    
                    <h3 className="text-xl text-gray-900 mb-2 font-bold">
                      {opportunity.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {opportunity.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {opportunity.time}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {opportunity.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-gray-700 mb-2">Requirements:</div>
                      {opportunity.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{req}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOpportunity(opportunity.id);
                        document.getElementById('volunteer-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white hover:text-white rounded-full"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="volunteer-form" className="py-16 md:py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4 font-bold">
                Apply to Volunteer
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and we'll be in touch soon
              </p>
            </div>

            <Card className="border-0 shadow-sm rounded-3xl p-6 md:p-8 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="opportunity">Volunteer Opportunity *</Label>
                  <Select
                    value={selectedOpportunity || ''}
                    onValueChange={(value) => setSelectedOpportunity(value)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select an opportunity" />
                    </SelectTrigger>
                    <SelectContent>
                      {opportunities.map((opp) => (
                        <SelectItem key={opp.id} value={opp.id}>
                          {opp.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="John Mensah"
                      className="rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className="rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className="rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City/Region"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    placeholder="e.g., Weekends, Evenings, Flexible"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Relevant Skills & Experience</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="Tell us about your skills and any relevant experience..."
                    className="rounded-xl min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Why do you want to volunteer with Sankofa-Coin?</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Share your motivation and what you hope to contribute..."
                    className="rounded-xl min-h-[120px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white rounded-full py-6"
                >
                  Submit Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4 font-bold">
                Volunteer Impact Stories
              </h2>
              <p className="text-lg text-gray-600">
                Hear from our volunteers making a difference
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-0 shadow-sm rounded-3xl p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-3">
                    <Heart className="h-6 w-6 text-[#10b981]" />
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "Volunteering with Sankofa has shown me how small actions create big change. 
                    Our community is cleaner and healthier!"
                  </p>
                  <div>
                    <div className="text-gray-900">Akosua Mensah</div>
                    <div className="text-sm text-gray-600">Community Cleanup Coordinator</div>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mb-3">
                    <BookOpen className="h-6 w-6 text-[#3b82f6]" />
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "Teaching communities about health impacts has been incredibly rewarding. 
                    Knowledge truly is power."
                  </p>
                  <div>
                    <div className="text-gray-900">Kwame Osei</div>
                    <div className="text-sm text-gray-600">Health Education Ambassador</div>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#FBBF24]/10 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-[#FBBF24]" />
                  </div>
                  <p className="text-gray-600 italic mb-4">
                    "Working at the hub, I see firsthand how plastic collection transforms lives 
                    and improves health outcomes."
                  </p>
                  <div>
                    <div className="text-gray-900">Ama Boateng</div>
                    <div className="text-sm text-gray-600">Hub Assistant</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
