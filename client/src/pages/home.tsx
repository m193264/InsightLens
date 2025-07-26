import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Compass, UserCircle, Brain, Users, TrendingUp, Star, Eye, Route } from "lucide-react";

const mentors = [
  {
    id: "MarcusAI",
    name: "MarcusAI",
    description: "Stoic wisdom & leadership insights",
    image: "https://images.unsplash.com/photo-CTNU0RtE1no?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "MayaAI", 
    name: "MayaAI",
    description: "Emotional intelligence & empathy",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "SteveAI",
    name: "SteveAI", 
    description: "Innovation & perfectionism",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "KobeAI",
    name: "KobeAI",
    description: "Mamba mentality & excellence", 
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "MandelaAI",
    name: "MandelaAI",
    description: "Reconciliation & moral courage",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "KobunAI",
    name: "KobunAI", 
    description: "Zen wisdom & mindfulness",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  }
];

const focusAreas = [
  {
    icon: <Star className="w-5 h-5 text-primary" />,
    title: "Leadership Style",
    description: "How you influence and guide others"
  },
  {
    icon: <Users className="w-5 h-5 text-primary" />,
    title: "Communication", 
    description: "How you express ideas and listen"
  },
  {
    icon: <Brain className="w-5 h-5 text-primary" />,
    title: "Emotional Intelligence",
    description: "How you manage emotions and relationships"
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-primary" />,
    title: "Problem Solving",
    description: "How you approach challenges and decisions"
  },
  {
    icon: <Users className="w-5 h-5 text-primary" />,
    title: "Collaboration",
    description: "How you work with teams and build trust"
  },
  {
    icon: <Compass className="w-5 h-5 text-primary" />,
    title: "Character & Values", 
    description: "Your core principles and integrity"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">
            Who are you <span className="text-primary">really</span>?
          </h1>
          <p className="text-xl text-neutral-500 mb-8 max-w-3xl mx-auto">
            Get honest, anonymous feedback from people who know you best. AI analyzes the patterns to reveal your strengths, blind spots, and limiting beliefs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold">
                Start Your 360° Analysis
              </Button>
            </Link>
            <Button variant="ghost" className="text-neutral-500 hover:text-neutral-900 flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </span>
              <span>Watch Demo (2 min)</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCircle className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">1. Set Your Focus</h3>
              <p className="text-neutral-500">Choose insight areas like leadership, communication, or character traits you want feedback on.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="text-secondary w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">2. Choose AI Mentor</h3>
              <p className="text-neutral-500">Select an AI mentor (Marcus Aurelius, Maya Angelou, etc.) to guide your analysis.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-accent w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">3. Invite Your Circle</h3>
              <p className="text-neutral-500">Add 2-10 people who know you well. They'll give anonymous, structured feedback.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-orange-600 w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">4. Get Insights</h3>
              <p className="text-neutral-500">AI analyzes patterns to reveal your personality, strengths, blind spots, and growth opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Mentor Selection Preview */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Choose Your AI Mentor</h2>
            <p className="text-xl text-neutral-500">Each mentor brings unique wisdom to analyze your feedback</p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
                <img 
                  src={mentor.image} 
                  alt={`${mentor.name} AI`} 
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-neutral-900 mb-2">{mentor.name}</h3>
                <p className="text-sm text-neutral-500">{mentor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Select Your Insight Areas</h2>
            <p className="text-xl text-neutral-500">Focus on the areas that matter most for your growth</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {focusAreas.map((area, index) => (
              <div key={index} className="flex items-center p-4 bg-neutral-50 rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  {area.icon}
                  <div>
                    <span className="font-medium text-neutral-900">{area.title}</span>
                    <p className="text-sm text-neutral-500 mt-1">{area.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/onboarding">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
