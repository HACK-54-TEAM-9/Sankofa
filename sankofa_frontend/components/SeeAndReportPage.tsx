import { useState, useEffect } from 'react';
import { Camera, MapPin, Upload, AlertCircle, CheckCircle2, Loader2, Navigation as NavigationIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SeeAndReportPageProps {
  onNavigate: (page: string) => void;
}

export function SeeAndReportPage({ onNavigate }: SeeAndReportPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    description: '',
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Clear popup dismissal when user visits the page
  useEffect(() => {
    localStorage.removeItem('seeReportPopupDismissedTime');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check if it's a video
    const hasVideo = files.some(file => file.type.startsWith('video/'));
    const hasImages = files.some(file => file.type.startsWith('image/'));
    
    // Validation: Either up to 3 images OR 1 video
    if (hasVideo && files.length > 1) {
      toast.error('You can only upload 1 video per report');
      return;
    }
    
    if (hasVideo && hasImages) {
      toast.error('You cannot mix images and videos. Please upload either images or a video.');
      return;
    }
    
    if (hasImages && files.length > 3) {
      toast.error('You can only upload up to 3 images');
      return;
    }

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    
    setMediaFiles(files);
    setMediaPreviews(previews);
  };

  const removeMedia = (index: number) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index);
    const newPreviews = mediaPreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(mediaPreviews[index]);
    
    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });
        setIsGettingLocation(false);
        toast.success('Location captured successfully');
      },
      (error) => {
        setIsGettingLocation(false);
        toast.error('Unable to retrieve your location');
        console.error('Geolocation error:', error);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.email || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (mediaFiles.length === 0) {
      toast.error('Please upload at least 1 photo or video');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      
      // Append all media files
      mediaFiles.forEach((file, index) => {
        formDataToSend.append('media', file);
      });

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6c51ae02/submit-report`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      toast.success('Report submitted successfully! Our team will review it soon.');
      setSubmitted(true);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        description: '',
      });
      setMediaFiles([]);
      setMediaPreviews([]);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1662534264036-7bfa0d35de9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG9nZ2VkJTIwZ3V0dGVyJTIwcGxhc3RpYyUyMHdhc3RlJTIwYWZyaWNhfGVufDF8fHx8MTc2MTU1MDIzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Plastic waste"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#08A26F]/90"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
                <CheckCircle2 className="h-10 w-10 text-[#08A26F]" />
              </div>
              
              <h1 className="text-4xl md:text-5xl text-white mb-6">
                Thank You for Reporting!
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Your report has been submitted successfully. Our team will review it and take appropriate action. 
                Together, we're making Ghana cleaner and healthier.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-white text-[#08A26F] hover:bg-stone-100 rounded-full px-8 h-12"
                >
                  Submit Another Report
                </Button>
                <Button
                  onClick={() => onNavigate('home')}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 h-12"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1662534264036-7bfa0d35de9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG9nZ2VkJTIwZ3V0dGVyJTIwcGxhc3RpYyUyMHdhc3RlJTIwYWZyaWNhfGVufDF8fHx8MTc2MTU1MDIzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Plastic waste"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#08A26F]/90"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#FBBF24]/20 border border-[#FBBF24]/30 px-4 py-2 rounded-full mb-6">
              <Camera className="h-4 w-4 text-[#FBBF24]" />
              <span className="text-sm text-white">Community Reporting</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl text-white mb-6">
              See & Report
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Help us keep Ghana clean! Report clogged gutters, plastic waste, or environmental concerns in your area. 
              Your reports help us take action faster.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-3">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm text-white/80">Take Photos or Video</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-3">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm text-white/80">Add Location</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-3">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm text-white/80">We Take Action</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 shadow-lg border-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-2xl text-gray-900 mb-6">Your Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0501234567"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h2 className="text-2xl text-gray-900 mb-6">Location Details</h2>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter address or coordinates"
                        required
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="bg-[#08A26F] hover:bg-[#08A26F]/90 text-white px-4"
                      >
                        {isGettingLocation ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <NavigationIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Click the location icon to use your current GPS coordinates
                    </p>
                  </div>
                </div>

                {/* Report Details */}
                <div>
                  <h2 className="text-2xl text-gray-900 mb-6">Report Details</h2>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the issue in detail (e.g., type of waste, severity, any hazards)"
                      required
                      className="mt-2 min-h-[120px]"
                    />
                  </div>
                </div>

                {/* Media Upload */}
                <div>
                  <h2 className="text-2xl text-gray-900 mb-6">Evidence</h2>
                  <div>
                    <Label htmlFor="media">Upload Photos or Video *</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="media"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-10 w-10 text-gray-400 mb-3" />
                          <p className="mb-2 text-sm text-gray-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            Up to 3 photos OR 1 video (max 50MB)
                          </p>
                        </div>
                        <input
                          id="media"
                          name="media"
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Media Previews */}
                    {mediaPreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {mediaPreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            {mediaFiles[index].type.startsWith('video/') ? (
                              <video
                                src={preview}
                                className="w-full h-32 object-cover rounded-lg"
                                controls
                              />
                            ) : (
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => removeMedia(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#08A26F] hover:bg-[#08A26F]/90 text-white h-12 rounded-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Report...
                      </>
                    ) : (
                      'Submit Report'
                    )}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Info Box */}
            <Card className="mt-6 p-6 bg-[#FBBF24]/10 border-[#FBBF24]/20">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-[#FBBF24] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-gray-900 mb-2">What Happens Next?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Your report will be reviewed by our team within 24-48 hours. We'll assess the situation 
                    and coordinate with local authorities or our collection teams to address the issue. 
                    For urgent matters, please contact your local environmental health office directly.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
