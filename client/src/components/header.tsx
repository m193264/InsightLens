import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Compass } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Compass className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-neutral-900">InsightEngine</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-neutral-500 hover:text-neutral-900 transition-colors">How It Works</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-900 transition-colors">Privacy</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-900 transition-colors">Support</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-neutral-500 hover:text-neutral-900">
              Sign In
            </Button>
            <Link href="/onboarding">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
