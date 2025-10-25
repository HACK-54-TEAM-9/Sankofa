import { Card } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, Video, FileText, Download, ArrowRight } from 'lucide-react';

interface EducationalResourcesProps {
  onNavigate: (page: string) => void;
}

export function EducationalResources({ onNavigate }: EducationalResourcesProps) {
  const resources = [
    {
      title: 'Understanding Plastic & Health',
      description: 'Learn how plastic pollution affects community health and what you can do',
      icon: BookOpen,
      type: 'Guide',
      color: 'emerald',
    },
    {
      title: 'How to Collect Safely',
      description: 'Best practices for plastic collection to protect yourself and maximize earnings',
      icon: Video,
      type: 'Video Tutorial',
      color: 'blue',
    },
    {
      title: 'NHIS Enrollment Guide',
      description: 'Step-by-step process to use your Health Tokens for National Health Insurance',
      icon: FileText,
      type: 'PDF Guide',
      color: 'purple',
    },
    {
      title: 'Community Health Tips',
      description: 'Preventive health practices for vector-borne disease protection',
      icon: Download,
      type: 'Infographic',
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; iconBg: string; iconColor: string } } = {
      emerald: {
        bg: 'bg-[#10b981]/5',
        text: 'text-[#10b981]',
        iconBg: 'bg-[#10b981]/10',
        iconColor: 'text-[#10b981]',
      },
      blue: {
        bg: 'bg-[#3b82f6]/5',
        text: 'text-[#3b82f6]',
        iconBg: 'bg-[#3b82f6]/10',
        iconColor: 'text-[#3b82f6]',
      },
      purple: {
        bg: 'bg-[#8b5cf6]/5',
        text: 'text-[#8b5cf6]',
        iconBg: 'bg-[#8b5cf6]/10',
        iconColor: 'text-[#8b5cf6]',
      },
      orange: {
        bg: 'bg-[#f97316]/5',
        text: 'text-[#f97316]',
        iconBg: 'bg-[#f97316]/10',
        iconColor: 'text-[#f97316]',
      },
    };
    return colors[color];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl text-gray-900 mb-4">Educational Resources</h2>
        <p className="text-lg text-gray-600">
          Everything you need to know about plastic collection, health protection, and using our system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {resources.map((resource) => {
          const Icon = resource.icon;
          const colorClasses = getColorClasses(resource.color);

          return (
            <Card
              key={resource.title}
              className="bg-white border-0 shadow-sm rounded-3xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorClasses.iconBg} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-7 w-7 ${colorClasses.iconColor}`} />
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs mb-3 ${colorClasses.bg} ${colorClasses.text}`}>
                {resource.type}
              </div>
              <h3 className="text-lg text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {resource.description}
              </p>
              <button className={`text-sm ${colorClasses.text} hover:underline inline-flex items-center gap-1`}>
                Learn More
                <ArrowRight className="h-3 w-3" />
              </button>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-[#10b981]/5 to-[#3b82f6]/5 rounded-3xl p-8 md:p-12 text-center border border-[#10b981]/10">
        <h3 className="text-2xl text-gray-900 mb-4">Need Help Getting Started?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
          Our team is ready to answer your questions and help you understand how Sankofa-Coin can benefit you and your community.
        </p>
        <Button
          onClick={() => onNavigate('contact')}
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-full px-8 gap-2"
        >
          Contact Us
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
