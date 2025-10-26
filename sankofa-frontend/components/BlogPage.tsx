import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

export function BlogPage({ onNavigate }: BlogPageProps) {
  const blogPosts = [
    {
      title: 'How Plastic Waste Drives Malaria in Ghana',
      description: 'New data reveals the connection between plastic collection rates and reduced mosquito breeding sites in urban communities.',
      author: 'Dr. Ama Asante',
      date: '22 Oct 2025',
      image: 'https://images.unsplash.com/photo-1756362399416-503694e40cf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwcmVjeWNsaW5nJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NjEzNzYxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      title: 'October Collection Trends: What the Data Shows',
      description: 'Analysis of user behavior patterns reveals peak collection times and optimal hub distribution strategies.',
      author: 'Kwame Mensah',
      date: '20 Oct 2025',
      image: 'https://images.unsplash.com/photo-1568635186802-574f2a38acd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRlY2hub2xvZ3klMjBhZnJpY2F8ZW58MXx8fHwxNzYxMzkzNTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      title: 'Success Story: Kumasi Hub Reaches 15,000kg Milestone',
      description: "Meet the collectors transforming their community through plastic recycling. Here's how they achieved record-breaking collections.",
      author: 'Abena Osei',
      date: '18 Oct 2025',
      image: 'https://images.unsplash.com/photo-1657448740120-001a2345ab81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RhcnR1cCUyMGVudHJlcHJlbmV1cnxlbnwxfHx8fDE3NjEzOTM1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      title: 'Understanding Health Data Patterns in Plastic Hotspots',
      description: 'Our AI analytics show correlation between high plastic accumulation zones and increased respiratory illness reports.',
      author: 'Dr. Kofi Adjei',
      date: '15 Oct 2025',
      image: 'https://images.unsplash.com/photo-1732696683011-2f80bca1f38b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaGFuYSUyMGNvbW11bml0eSUyMGhlYWx0aHxlbnwxfHx8fDE3NjEzOTM1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    {
      title: 'Preventing Waterborne Diseases Through Plastic Recycling',
      description: 'Learn how removing plastic waste from water sources reduces cholera and typhoid risks in vulnerable communities.',
      author: 'Dr. Yaa Boateng',
      date: '12 Oct 2025',
      image: 'https://images.unsplash.com/photo-1740908900846-4bbd4f22c975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBkYXRhJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc2MTM5MzU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      title: 'Community Impact: How Collectors Are Improving Air Quality',
      description: 'Behavioral data shows consistent collection routines lead to cleaner neighborhoods and better respiratory health outcomes.',
      author: 'Emmanuel Darko',
      date: '10 Oct 2025',
      image: 'https://images.unsplash.com/photo-1759752394757-323a0adc0d62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjb2xsYWJvcmF0aW9uJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2MTM5MzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
      title: 'Best Practices for Safe Plastic Handling and Sorting',
      description: 'Health and safety guidelines for collectors to minimize exposure to harmful materials during collection and sorting.',
      author: 'Akosua Frimpong',
      date: '8 Oct 2025',
      image: 'https://images.unsplash.com/photo-1618521715147-29e4b97e2ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwY2xlYW51cCUyMHRlYW18ZW58MXx8fHwxNzYxMzkzNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
    {
      title: 'Podcast: The Science Behind Plastic and Public Health',
      description: 'Environmental health experts discuss how microplastics affect human health and what we can do to protect ourselves.',
      author: 'Dr. Nana Owusu',
      date: '5 Oct 2025',
      image: 'https://images.unsplash.com/photo-1758685848543-5c8ba81bc822?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcmVzZWFyY2glMjBsYWJ8ZW58MXx8fHwxNzYxMzQ5MjE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    {
      title: 'Building Trust: How Data Transparency Drives Participation',
      description: 'User engagement metrics show that sharing health insights and collection impact increases collector retention by 47%.',
      author: 'Grace Amponsah',
      date: '2 Oct 2025',
      image: 'https://images.unsplash.com/photo-1634710664586-fe890319a9fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBoZWFsdGglMjB3b3JrZXJ8ZW58MXx8fHwxNzYxMzkzNTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      avatar: 'https://i.pravatar.cc/150?img=11',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1634710664586-fe890319a9fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBoZWFsdGglMjB3b3JrZXJ8ZW58MXx8fHwxNzYxMzkzNTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm text-white/90 mb-4">Featured Article</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                How We Transformed 2 Million Plastic Bottles Into Better Health Outcomes
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Discover the data-driven insights from our first year of operations. From collection patterns to health improvements, here&apos;s what we learned about connecting plastic waste to predictive health intelligence in Ghana.
              </p>
            </div>
          </div>
          <button className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </section>

      {/* Recent blog posts */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl text-gray-900 mb-12">
              Recent blog posts
            </h2>

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {blogPosts.map((post, index) => (
                <article key={index} className="group cursor-pointer">
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl text-gray-900 group-hover:text-[#10b981] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <ImageWithFallback
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm text-gray-900">{post.author}</p>
                        <p className="text-sm text-gray-600">{post.date}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-16">
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 rounded-full px-8 py-6 hover:border-gray-400"
              >
                Load more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a1a1a] py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6">
              Join the Health-Tech Revolution
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Be part of Ghana&apos;s movement transforming plastic waste into better health outcomes for all.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-[#1a1a1a] rounded-full px-8 py-6"
                onClick={() => onNavigate('contact')}
              >
                Contact Us
              </Button>
              <Button 
                className="bg-[#10b981] hover:bg-[#059669] text-white rounded-full px-8 py-6"
                onClick={() => onNavigate('volunteer')}
              >
                Become a Collector
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
