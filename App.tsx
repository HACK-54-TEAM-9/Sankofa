import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { LocationInsightsPage } from './components/LocationInsightsPage';
import { CollectorPage } from './components/CollectorPage';
import { HubManagerPage } from './components/HubManagerPage';
import { DataInsightsPage } from './components/DataInsightsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { CollectorDashboard } from './components/CollectorDashboard';
import { HubManagerDashboard } from './components/HubManagerDashboard';
import { AIAssistantPage } from './components/AIAssistantPage';
import { VolunteerPage } from './components/VolunteerPage';
import { DonationsPage } from './components/DonationsPage';
import { MessagingPage } from './components/MessagingPage';
import { BlogPage } from './components/BlogPage';
import { Toaster } from './components/ui/sonner';

type PageType = 'home' | 'location-insights' | 'ai-assistant' | 'collector' | 'hub-manager' | 'data' | 'about' | 'contact' | 'login' | 'volunteer' | 'donations' | 'messaging' | 'blog';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const { user, isAuthenticated } = useAuth();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main>
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'location-insights' && <LocationInsightsPage onNavigate={handleNavigate} />}
        {currentPage === 'ai-assistant' && <AIAssistantPage />}
        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentPage === 'volunteer' && <VolunteerPage onNavigate={handleNavigate} />}
        {currentPage === 'donations' && <DonationsPage onNavigate={handleNavigate} />}
        {currentPage === 'messaging' && <MessagingPage />}
        {currentPage === 'blog' && <BlogPage onNavigate={handleNavigate} />}
        {currentPage === 'collector' && (
          isAuthenticated && user?.role === 'collector' ? (
            <CollectorDashboard onNavigate={handleNavigate} />
          ) : (
            <CollectorPage onNavigate={handleNavigate} />
          )
        )}
        {currentPage === 'hub-manager' && (
          isAuthenticated && user?.role === 'hub-manager' ? (
            <HubManagerDashboard onNavigate={handleNavigate} />
          ) : (
            <HubManagerPage onNavigate={handleNavigate} />
          )
        )}
        {currentPage === 'data' && <DataInsightsPage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700">
                  <span className="text-white">🐦</span>
                </div>
                <span className="text-white">Sankofa-Coin</span>
              </div>
              <p className="text-sm text-gray-400">
                Transforming plastic pollution into predictive health intelligence and healthcare access across Ghana.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => handleNavigate('home')} className="hover:text-emerald-400 transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('location-insights')} className="hover:text-emerald-400 transition-colors">
                    Location Health Insights
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('ai-assistant')} className="hover:text-emerald-400 transition-colors">
                    AI Assistant
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('volunteer')} className="hover:text-emerald-400 transition-colors">
                    Volunteer
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('donations')} className="hover:text-emerald-400 transition-colors">
                    Donate
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('data')} className="hover:text-emerald-400 transition-colors">
                    Data & Insights
                  </button>
                </li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="mb-4 text-white">About</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => handleNavigate('about')} className="hover:text-emerald-400 transition-colors">
                    Our Story
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('about')} className="hover:text-emerald-400 transition-colors">
                    Our Team
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('contact')} className="hover:text-emerald-400 transition-colors">
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="mailto:info@sankofacoin.org" className="hover:text-emerald-400 transition-colors">
                    info@sankofacoin.org
                  </a>
                </li>
                <li>
                  <a href="tel:+233302123456" className="hover:text-emerald-400 transition-colors">
                    +233 (0)30 212 3456
                  </a>
                </li>
                <li className="pt-2">
                  <div className="text-emerald-400">USSD Access:</div>
                  <div className="text-white">*800*726563#</div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 Sankofa Ghana Ltd. All rights reserved.</p>
            <p className="mt-2">
              Se wo were fi na wosankofa a yenkyi — It is not wrong to go back for that which you have forgotten
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
