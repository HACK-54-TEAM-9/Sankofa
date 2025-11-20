import { useState, useEffect } from 'react';
import { Camera, X, MapPin, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface SeeAndReportPopupProps {
  onNavigate: (page: string) => void;
}

export function SeeAndReportPopup({ onNavigate }: SeeAndReportPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if user has already dismissed the popup permanently
    const dismissedPermanently = localStorage.getItem('seeReportPopupDismissed');
    const dismissedTime = localStorage.getItem('seeReportPopupDismissedTime');
    
    // If dismissed permanently, don't show
    if (dismissedPermanently === 'permanent') {
      return;
    }
    
    // If dismissed temporarily, check if 24 hours have passed
    if (dismissedTime) {
      const timePassed = Date.now() - parseInt(dismissedTime);
      const hoursPasssed = timePassed / (1000 * 60 * 60);
      
      // Show again after 24 hours
      if (hoursPasssed < 24) {
        return;
      }
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll percentage
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

      // Show popup after user scrolls down 20% of the page
      if (scrollPercentage > 20 && !hasScrolled) {
        setHasScrolled(true);

        // Clear any existing timeout
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        // Set a delay of 2 seconds after scroll stops
        const timeout = setTimeout(() => {
          setIsOpen(true);
        }, 2000);

        setScrollTimeout(timeout);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [hasScrolled, scrollTimeout]);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user dismissed the popup permanently
    localStorage.setItem('seeReportPopupDismissed', 'permanent');
  };

  const handleReportNow = () => {
    setIsOpen(false);
    localStorage.setItem('seeReportPopupDismissed', 'permanent');
    onNavigate('see-report');
  };

  const handleRemindLater = () => {
    setIsOpen(false);
    // Set temporary dismissal with timestamp - will show again after 24 hours
    localStorage.setItem('seeReportPopupDismissedTime', Date.now().toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 gap-0 shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Report Plastic Waste</DialogTitle>
        <DialogDescription className="sr-only">
          Help us keep Ghana clean by reporting plastic waste and clogged gutters in your area. Quick photo upload with GPS location.
        </DialogDescription>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Header with background */}
              <div className="relative p-8 pb-12 overflow-hidden">
                {/* Background image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1637681316418-dd7a4b6e545e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwd2FzdGUlMjBwb2xsdXRpb258ZW58MXx8fHwxNzYxNTc4MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')` }}
                />
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-[#08A26F]/85" />
                
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
                  aria-label="Close popup"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4 relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl text-white text-center mb-2 relative z-10">
                  See Plastic Waste in Your Area?
                </h2>
                <p className="text-white/90 text-center text-sm relative z-10">
                  Help us keep Ghana clean by reporting it!
                </p>
              </div>

              {/* Content */}
              <div className="bg-white p-6 -mt-6 relative z-10 rounded-t-3xl">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FBBF24]/20 flex items-center justify-center flex-shrink-0">
                      <Camera className="h-5 w-5 text-[#FBBF24]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">Quick Photo Upload</h3>
                      <p className="text-sm text-gray-600">
                        Snap a photo of clogged gutters or illegal dumping
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FBBF24]/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-[#FBBF24]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">Add Location</h3>
                      <p className="text-sm text-gray-600">
                        Automatically detect or manually enter the location
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FBBF24]/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-[#FBBF24]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">We Take Action</h3>
                      <p className="text-sm text-gray-600">
                        Our team reviews and addresses reports within 24-48 hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleReportNow}
                    className="w-full bg-[#08A26F] hover:bg-[#08A26F]/90 text-white h-12 rounded-full"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Report an Issue Now
                  </Button>
                  
                  <Button
                    onClick={handleRemindLater}
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                  >
                    Remind Me Later
                  </Button>
                </div>

                {/* Footer note */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Takes less than 2 minutes • Available to everyone
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
