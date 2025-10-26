import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';

interface AIFloatingButtonProps {
  onNavigate: (page: string) => void;
}

export function AIFloatingButton({ onNavigate }: AIFloatingButtonProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <div className="bg-white shadow-lg rounded-2xl px-4 py-3 max-w-xs border border-gray-200 animate-in slide-in-from-right">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Need help?</strong> Ask Sankofa AI anything!
          </p>
          <p className="text-xs text-gray-500">
            Get instant answers about health risks, plastic collection, and more.
          </p>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => onNavigate('ai-assistant')}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        size="icon"
      >
        <Sparkles className="h-6 w-6 text-white animate-pulse" />
      </Button>
    </div>
  );
}
