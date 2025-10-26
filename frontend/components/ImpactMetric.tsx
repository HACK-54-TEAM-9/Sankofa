import { Card } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface ImpactMetricProps {
  icon: LucideIcon;
  value: string;
  label: string;
  color?: 'green' | 'blue' | 'orange' | 'gold';
}

export function ImpactMetric({ icon: Icon, value, label, color = 'green' }: ImpactMetricProps) {
  const colorClasses = {
    green: {
      bg: 'bg-[#10b981]/10',
      icon: 'text-[#10b981]',
      text: 'text-[#10b981]'
    },
    blue: {
      bg: 'bg-[#3b82f6]/10',
      icon: 'text-[#3b82f6]',
      text: 'text-[#3b82f6]'
    },
    orange: {
      bg: 'bg-[#f97316]/10',
      icon: 'text-[#f97316]',
      text: 'text-[#f97316]'
    },
    gold: {
      bg: 'bg-[#FBBF24]/10',
      icon: 'text-[#FBBF24]',
      text: 'text-[#FBBF24]'
    }
  };

  const colors = colorClasses[color];

  return (
    <Card className="bg-white border-0 shadow-sm rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
      <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${colors.bg} mb-4`}>
        <Icon className={`h-8 w-8 ${colors.icon}`} />
      </div>
      <div className={`text-3xl mb-2 ${colors.text}`}>
        {value}
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </Card>
  );
}
