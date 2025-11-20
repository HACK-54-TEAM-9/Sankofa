import { Button } from './ui/button';
import { HandCoins, Users, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthContext';

interface CTAButtonsProps {
  onNavigate: (page: string) => void;
  variant?: 'hero' | 'inline';
}

export function CTAButtons({ onNavigate, variant = 'hero' }: CTAButtonsProps) {
  const { isAuthenticated, user } = useAuth();

  if (variant === 'hero') {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {isAuthenticated && user ? (
          <Button
            size="lg"
            onClick={() => onNavigate(user.role === 'collector' ? 'collector' : 'hub-manager')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full px-8 gap-2"
          >
            <Users className="h-5 w-5" />
            Go to My Dashboard
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              onClick={() => onNavigate('collector')}
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full px-8 gap-2"
            >
              <HandCoins className="h-5 w-5" />
              Become a Collector
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('hub-manager')}
              className="border-2 border-gray-300 hover:border-gray-400 rounded-full px-8 gap-2"
            >
              <Users className="h-5 w-5" />
              Become a Hub Manager
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      {isAuthenticated && user ? (
        <Button
          onClick={() => onNavigate(user.role === 'collector' ? 'collector' : 'hub-manager')}
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white hover:text-white rounded-full gap-2"
        >
          <Users className="h-4 w-4" />
          My Dashboard
        </Button>
      ) : (
        <>
          <Button
            onClick={() => onNavigate('collector')}
            className="bg-[#10b981] hover:bg-[#059669] rounded-full gap-2"
          >
            <HandCoins className="h-4 w-4" />
            Become a Collector
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('hub-manager')}
            className="border-2 border-gray-300 hover:border-gray-400 rounded-full gap-2"
          >
            <Users className="h-4 w-4" />
            Become a Hub Manager
          </Button>
        </>
      )}
    </div>
  );
}
