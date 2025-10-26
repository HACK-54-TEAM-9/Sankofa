import { useState } from 'react';
import { Heart, Users, Droplets, TrendingUp, CheckCircle2, ArrowRight, Gift, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';

interface DonationsPageProps {
  onNavigate: (page: string) => void;
}

export function DonationsPage({ onNavigate }: DonationsPageProps) {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const donationTiers = [
    {
      amount: 50,
      title: 'Community Supporter',
      icon: Users,
      impact: [
        'Provides plastic collection bags for 10 collectors',
        'Funds 1 community health education session',
        'Supports NHIS enrollment for 2 individuals'
      ]
    },
    {
      amount: 100,
      title: 'Health Champion',
      icon: Heart,
      impact: [
        'Equips a collection hub with weighing scales',
        'Funds malaria prevention supplies for 50 families',
        'Provides health insurance for 5 collectors'
      ]
    },
    {
      amount: 250,
      title: 'Impact Partner',
      icon: TrendingUp,
      impact: [
        'Establishes a new collection hub',
        'Funds a month of AI health data analysis',
        'Provides NHIS coverage for 15 people'
      ]
    },
    {
      amount: 500,
      title: 'Change Maker',
      icon: Shield,
      impact: [
        'Supports 3 community cleanup events',
        'Funds comprehensive health screening for 100 people',
        'Provides equipment for 2 collection hubs'
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = selectedAmount === 'custom' ? customAmount : selectedAmount;
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please select or enter a donation amount');
      return;
    }

    if (!formData.name || !formData.email) {
      toast.error('Please fill in your name and email');
      return;
    }

    // Simulate payment processing
    toast.success(`Thank you for your ${donationType === 'monthly' ? 'monthly' : ''} donation of GH₵${amount}!`);
    
    // Reset form
    setSelectedAmount('');
    setCustomAmount('');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FBBF24]/10 to-[#10b981]/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#FBBF24]/20 border border-[#FBBF24]/30 px-4 py-2 rounded-full mb-6">
              <Gift className="h-4 w-4 text-[#FBBF24]" />
              <span className="text-sm text-gray-700">Support Our Mission</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl text-gray-900 mb-6">
              Every Donation <span className="text-[#10b981]">Saves Lives</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your contribution directly funds plastic collection rewards, healthcare access, 
              and predictive health intelligence for communities across Ghana.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl text-gray-900 mb-2">GH₵847K</div>
                <div className="text-sm text-gray-600">Raised This Year</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-gray-900 mb-2">12,400+</div>
                <div className="text-sm text-gray-600">Lives Impacted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-gray-900 mb-2">98%</div>
                <div className="text-sm text-gray-600">Goes to Programs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Impact */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
                Where Your Money Goes
              </h2>
              <p className="text-lg text-gray-600">
                Choose your impact level and see the difference you'll make
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-16">
              {donationTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <Card
                    key={tier.amount}
                    className={`border-0 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-lg transition-all cursor-pointer ${
                      selectedAmount === tier.amount.toString() ? 'ring-2 ring-[#10b981]' : ''
                    }`}
                    onClick={() => {
                      setSelectedAmount(tier.amount.toString());
                      document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10b981]/10">
                        <Icon className="h-6 w-6 text-[#10b981]" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl text-gray-900">GH₵{tier.amount}</div>
                        <div className="text-sm text-gray-600">{donationType === 'monthly' ? '/month' : 'one-time'}</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl text-gray-900 mb-4">
                      {tier.title}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="text-sm text-gray-700 mb-2">Your Impact:</div>
                      {tier.impact.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAmount(tier.amount.toString());
                        document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full mt-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-full"
                    >
                      Donate GH₵{tier.amount}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section id="donation-form" className="py-16 md:py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
                Complete Your Donation
              </h2>
              <p className="text-lg text-gray-600">
                Every contribution makes a meaningful difference
              </p>
            </div>

            <Card className="border-0 shadow-sm rounded-3xl p-6 md:p-8 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Donation Type */}
                <div className="space-y-3">
                  <Label>Donation Frequency</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setDonationType('one-time')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        donationType === 'one-time'
                          ? 'border-[#10b981] bg-[#10b981]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-gray-900">One-time</div>
                      <div className="text-sm text-gray-600">Single donation</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonationType('monthly')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        donationType === 'monthly'
                          ? 'border-[#10b981] bg-[#10b981]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-gray-900">Monthly</div>
                      <div className="text-sm text-gray-600">Recurring impact</div>
                    </button>
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="space-y-3">
                  <Label>Donation Amount (GH₵)</Label>
                  <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
                    <div className="grid grid-cols-2 gap-3">
                      {[50, 100, 250, 500].map((amount) => (
                        <div
                          key={amount}
                          className={`relative flex items-center space-x-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedAmount === amount.toString()
                              ? 'border-[#10b981] bg-[#10b981]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedAmount(amount.toString())}
                        >
                          <RadioGroupItem value={amount.toString()} id={`amount-${amount}`} />
                          <Label htmlFor={`amount-${amount}`} className="cursor-pointer flex-1">
                            GH₵{amount}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`relative flex items-center space-x-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAmount === 'custom'
                          ? 'border-[#10b981] bg-[#10b981]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAmount('custom')}
                    >
                      <RadioGroupItem value="custom" id="amount-custom" />
                      <Label htmlFor="amount-custom" className="cursor-pointer">
                        Custom Amount
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {selectedAmount === 'custom' && (
                    <Input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="rounded-xl"
                      min="1"
                    />
                  )}
                </div>

                {/* Donor Information */}
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

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Leave a message of support..."
                    className="rounded-xl min-h-[100px]"
                  />
                </div>

                {/* Mock Payment Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <div className="mb-1">Demo Mode</div>
                      <div className="text-blue-700">
                        This is a demonstration. No actual payment will be processed. 
                        In production, integrate with Mobile Money, bank transfer, or international payment gateways.
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white rounded-full py-6"
                >
                  Complete Donation
                  <Heart className="ml-2 h-5 w-5" />
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
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
                Donor Impact Stories
              </h2>
              <p className="text-lg text-gray-600">
                See how donations transform communities
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-0 shadow-sm rounded-3xl p-6">
                <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-[#10b981]" />
                </div>
                <div className="text-xl text-gray-900 mb-2">4,500 kg</div>
                <p className="text-gray-600 mb-3">
                  Of plastic removed from communities in the last month through donor-funded collection programs
                </p>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl p-6">
                <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <div className="text-xl text-gray-900 mb-2">1,847 People</div>
                <p className="text-gray-600 mb-3">
                  Gained access to NHIS healthcare coverage through donor-supported Health Token savings
                </p>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl p-6">
                <div className="w-12 h-12 rounded-full bg-[#FBBF24]/10 flex items-center justify-center mb-4">
                  <Droplets className="h-6 w-6 text-[#FBBF24]" />
                </div>
                <div className="text-xl text-gray-900 mb-2">23% Reduction</div>
                <p className="text-gray-600 mb-3">
                  In waterborne disease cases in donor-supported communities over 6 months
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#10b981]/5 to-[#3b82f6]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl text-gray-900 mb-6">
              Other Ways to Support
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Not ready to donate? There are other ways to help our mission
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => onNavigate('volunteer')}
                variant="outline"
                className="rounded-full border-2 px-6"
              >
                Volunteer Your Time
              </Button>
              <Button
                onClick={() => onNavigate('collector')}
                variant="outline"
                className="rounded-full border-2 px-6"
              >
                Become a Collector
              </Button>
              <Button
                onClick={() => onNavigate('contact')}
                variant="outline"
                className="rounded-full border-2 px-6"
              >
                Corporate Partnership
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
