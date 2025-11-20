import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface HubManagerApplicationFormProps {
  onBack: () => void;
}

export function HubManagerApplicationForm({ onBack }: HubManagerApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    community: '',
    region: '',
    experience: '',
    why: '',
    availability: '',
    references: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6c51ae02/hub-manager-application`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Application submission error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 md:p-12 text-center bg-white border-0 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#08A26F] mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-gray-900 mb-4">Application Submitted Successfully!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your interest in becoming a Hub Manager. We have received your
                application and will review it within 5-7 business days.
              </p>
              <p className="text-gray-600 mb-8">
                We'll contact you via email at <strong>{formData.email}</strong> or phone at{' '}
                <strong>{formData.phone}</strong> with next steps.
              </p>
              <Button
                onClick={onBack}
                className="bg-[#08A26F] hover:bg-[#059669] text-white rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub Manager Info
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={onBack}
              variant="ghost"
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-gray-900 mb-4">Hub Manager Application</h1>
            <p className="text-lg text-gray-600">
              Complete the form below to apply to become a Sankofa Hub Manager
            </p>
          </div>

          {/* Form */}
          <Card className="p-6 md:p-8 bg-white border-0 shadow-sm">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-gray-900 mb-4">Personal Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="rounded-xl mt-1"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="rounded-xl mt-1"
                      placeholder="0XX XXX XXXX"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-xl mt-1"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-gray-900 mb-4">Location</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="community">Community/Neighborhood *</Label>
                    <Input
                      id="community"
                      name="community"
                      type="text"
                      required
                      value={formData.community}
                      onChange={handleInputChange}
                      className="rounded-xl mt-1"
                      placeholder="e.g., Jamestown, Accra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Region *</Label>
                    <Input
                      id="region"
                      name="region"
                      type="text"
                      required
                      value={formData.region}
                      onChange={handleInputChange}
                      className="rounded-xl mt-1"
                      placeholder="e.g., Greater Accra"
                    />
                  </div>
                </div>
              </div>

              {/* Experience & Motivation */}
              <div>
                <h3 className="text-gray-900 mb-4">Background</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="experience">
                      Relevant Experience (community leadership, business, etc.) *
                    </Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="rounded-xl mt-1 min-h-24"
                      placeholder="Tell us about your experience in community leadership, business management, or related areas..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="why">Why do you want to become a Hub Manager? *</Label>
                    <Textarea
                      id="why"
                      name="why"
                      required
                      value={formData.why}
                      onChange={handleInputChange}
                      className="rounded-xl mt-1 min-h-24"
                      placeholder="Share your motivation for wanting to serve your community as a Hub Manager..."
                    />
                  </div>
                </div>
              </div>

              {/* Availability & References */}
              <div>
                <h3 className="text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="availability">
                      Your Availability (hours per week) *
                    </Label>
                    <Input
                      id="availability"
                      name="availability"
                      type="text"
                      required
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="rounded-xl mt-1"
                      placeholder="e.g., 20-25 hours per week, flexible schedule"
                    />
                  </div>
                  <div>
                    <Label htmlFor="references">
                      Community References (names and contact info of 2 people who can vouch for
                      you) *
                    </Label>
                    <Textarea
                      id="references"
                      name="references"
                      required
                      value={formData.references}
                      onChange={handleInputChange}
                      className="rounded-xl mt-1 min-h-24"
                      placeholder="1. Name, relationship, phone number&#10;2. Name, relationship, phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#08A26F] hover:bg-[#059669] text-white rounded-xl py-6"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  By submitting this application, you confirm that all information provided is
                  accurate and complete.
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
