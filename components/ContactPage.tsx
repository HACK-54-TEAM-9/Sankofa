import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    alert('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const faqs = [
    {
      question: 'What types of plastic do you accept?',
      answer: 'We accept all common plastic types including PET bottles, HDPE containers, plastic bags, and food packaging. Our Hub Managers will help you identify acceptable materials. The most valuable plastics are clean PET bottles and HDPE containers.',
    },
    {
      question: 'How do I check my Health Token balance?',
      answer: 'You can check your balance in three ways: (1) Visit your local Hub and ask your Hub Manager, (2) Dial *800*726563# on any mobile phone for USSD access, or (3) Send "BAL" via SMS to 2626. Your balance will be displayed immediately.',
    },
    {
      question: 'Can I use my Health Tokens for family members?',
      answer: 'Yes! Health Tokens can be used to enroll or renew NHIS coverage for yourself and your immediate family members (spouse and children under 18). Simply inform your Hub Manager when you want to use your tokens for family healthcare.',
    },
    {
      question: 'How much do you pay per kilogram of plastic?',
      answer: 'Payment rates vary by plastic type and market conditions, but average GHâ‚µ1.80-2.50 per kilogram. Clean, sorted plastic earns higher rates. Remember, 70% is paid as instant cash and 30% saved as Health Tokens.',
    },
    {
      question: 'Do I need a bank account to participate?',
      answer: 'No! This is one of our core principles. You receive your 70% cash payment directly at the Hubâ€”no bank account needed. Your 30% Health Tokens are tracked digitally and can be used without any banking infrastructure.',
    },
    {
      question: 'What is the USSD/SMS system for feature phone users?',
      answer: 'We provide full access via USSD (*800*726563#) and SMS (text to 2626) for those with basic mobile phones. You can check balances, find Hubs, get health tips, and moreâ€”no smartphone or internet required.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#10b981] to-[#14b8a6] text-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">Get in Touch</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 text-white leading-tight">
              Contact Us
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Have questions? We're here to help. Reach out anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods & Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl text-gray-900 mb-6">Let's Talk</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Whether you're a potential Collector, Hub Manager, or just curious about our work, we'd love to hear from you.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#10b981]/10">
                      <Mail className="h-6 w-6 text-[#10b981]" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900 mb-1">Email Us</h3>
                      <p className="text-gray-600">info@sankofacoin.gh</p>
                      <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#3b82f6]/10">
                      <Phone className="h-6 w-6 text-[#3b82f6]" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900 mb-1">Call or Text</h3>
                      <p className="text-gray-600">+233 (0) 30 123 4567</p>
                      <p className="text-sm text-gray-500 mt-1">Mon-Fri: 8am - 6pm GMT</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FBBF24]/10">
                      <MapPin className="h-6 w-6 text-[#FBBF24]" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900 mb-1">Visit Our Office</h3>
                      <p className="text-gray-600">123 Liberation Road, Accra, Ghana</p>
                      <p className="text-sm text-gray-500 mt-1">Or visit any local Hub</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#10b981]/5 to-[#3b82f6]/5 rounded-3xl p-8 border border-[#10b981]/10">
                  <h3 className="text-xl text-gray-900 mb-3">Feature Phone Access</h3>
                  <p className="text-gray-600 mb-4">No smartphone? No problem!</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#10b981]"></div>
                      <span className="text-gray-700">USSD: Dial *800*726563#</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#3b82f6]"></div>
                      <span className="text-gray-700">SMS: Text to 2626</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="bg-white border-0 shadow-sm rounded-3xl p-8 md:p-10">
                <h3 className="text-2xl text-gray-900 mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-900 mb-2 block">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-900 mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-900 mb-2 block">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+233 (0) XX XXX XXXX"
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-900 mb-2 block">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      required
                      rows={5}
                      className="rounded-xl border-gray-200 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Quick answers to common questions
              </p>
            </div>

            <Card className="bg-white border-0 shadow-sm rounded-3xl p-8">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <AccordionTrigger className="text-left text-gray-900 hover:text-[#10b981] py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Join thousands of Ghanaians making a difference for health and environment
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => onNavigate('collector')}
                size="lg"
                className="bg-[#10b981] hover:bg-[#059669] rounded-full px-8"
              >
                Become a Collector
              </Button>
              <Button
                onClick={() => onNavigate('hub-manager')}
                size="lg"
                variant="outline"
                className="border border-white text-white hover:bg-white hover:text-[#1a1a1a] rounded-full px-8"
              >
                Become a Hub Manager
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
