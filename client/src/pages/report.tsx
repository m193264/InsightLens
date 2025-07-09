import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Star, Eye, Route, Download, Share, RotateCcw, CheckCircle } from "lucide-react";

const mentorImages: Record<string, string> = {
  MarcusAI: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  MayaAI: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  SteveAI: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  KobeAI: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  MandelaAI: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  KobunAI: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
};

export default function Report() {
  const params = useParams();
  const surveyId = parseInt(params.id || "0");

  const { data: survey, isLoading } = useQuery({
    queryKey: ["/api/surveys", surveyId],
    enabled: !!surveyId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading report...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!survey || !survey.reportData) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Report not found</h1>
            <p className="text-neutral-500 mb-6">This report may not be ready yet or doesn't exist.</p>
            <Link href={`/dashboard/${surveyId}`}>
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { reportData } = survey;
  const completedResponses = survey.invitations?.filter((inv: any) => inv.status === "completed").length || 0;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Header Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Report Generated</span>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Your 360° Insight Report</h1>
            <p className="text-xl text-neutral-500">
              Based on feedback from {completedResponses} people who know you well
            </p>
          </div>

          {/* Personality Snapshot & Mentor Commentary */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Personality Snapshot */}
            <div className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Your Personality Snapshot</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">MBTI Inference</h3>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {reportData.personality?.mbtiInference || "ENTJ"}
                  </div>
                  <p className="text-neutral-500">
                    {reportData.personality?.mbtiDescription || "The Executive - Natural leader with strategic vision"}
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">Core Archetype</h3>
                  <div className="text-lg font-bold text-secondary mb-2">
                    {reportData.personality?.coreArchetype || "The Visionary Leader"}
                  </div>
                  <p className="text-neutral-500">
                    {reportData.personality?.archetypeDescription || "Drives innovation while inspiring others"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-neutral-900 mb-4">Key Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {reportData.personality?.keyTraits?.map((trait: string) => (
                    <Badge key={trait} className="bg-primary/10 text-primary hover:bg-primary/10">
                      {trait}
                    </Badge>
                  )) || (
                    <>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Strategic Thinker</Badge>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Natural Motivator</Badge>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Results-Oriented</Badge>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Decisive</Badge>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Ambitious</Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* AI Mentor Commentary */}
            <div className="bg-neutral-50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={mentorImages[survey.aiMentor] || mentorImages.MarcusAI}
                  alt={`${survey.aiMentor} AI`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-neutral-900">{survey.aiMentor} Insight</h3>
                  <p className="text-sm text-neutral-500">Your chosen mentor</p>
                </div>
              </div>
              <blockquote className="text-neutral-700 italic">
                "{reportData.mentorCommentary || "Your leadership emerges not from position, but from clarity of purpose. The feedback reveals someone who inspires through vision, yet must remember: true strength lies in knowing when to listen as deeply as you lead."}"
              </blockquote>
            </div>
          </div>

          {/* Strengths & Blind Spots */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Strengths */}
            <div className="bg-gradient-to-br from-accent/5 to-green-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                <Star className="text-accent mr-3 w-6 h-6" />
                Your Superpowers
              </h2>
              <div className="space-y-4">
                {reportData.strengths?.map((strength: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-neutral-900 mb-2">{strength.title}</h4>
                    <p className="text-neutral-600 text-sm mb-2">{strength.description}</p>
                    {strength.frequency && (
                      <div className="text-xs text-accent font-medium">{strength.frequency}</div>
                    )}
                  </div>
                )) || (
                  <>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-neutral-900 mb-2">Visionary Communication</h4>
                      <p className="text-neutral-600 text-sm mb-2">You paint compelling pictures of the future that motivate teams to action.</p>
                      <div className="text-xs text-accent font-medium">Mentioned by 7/8 respondents</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-neutral-900 mb-2">Strategic Problem Solving</h4>
                      <p className="text-neutral-600 text-sm mb-2">You quickly identify core issues and develop comprehensive solutions.</p>
                      <div className="text-xs text-accent font-medium">Mentioned by 6/8 respondents</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-neutral-900 mb-2">Authentic Leadership</h4>
                      <p className="text-neutral-600 text-sm mb-2">People trust you because you lead with integrity and genuine care.</p>
                      <div className="text-xs text-accent font-medium">Mentioned by 6/8 respondents</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Blind Spots */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                <Eye className="text-orange-600 mr-3 w-6 h-6" />
                Blind Spots
              </h2>
              <div className="space-y-4">
                {reportData.blindSpots?.map((blindSpot: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-neutral-900 mb-2">{blindSpot.title}</h4>
                    <p className="text-neutral-600 text-sm mb-2">{blindSpot.description}</p>
                    {blindSpot.frequency && (
                      <div className="text-xs text-orange-600 font-medium">{blindSpot.frequency}</div>
                    )}
                  </div>
                )) || (
                  <>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-neutral-900 mb-2">Impatience with Details</h4>
                      <p className="text-neutral-600 text-sm mb-2">Your focus on big picture sometimes overlooks important specifics.</p>
                      <div className="text-xs text-orange-600 font-medium">Noted by 5/8 respondents</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-neutral-900 mb-2">Overwhelming Communication Style</h4>
                      <p className="text-neutral-600 text-sm mb-2">Your enthusiasm can sometimes dominate conversations.</p>
                      <div className="text-xs text-orange-600 font-medium">Noted by 4/8 respondents</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-neutral-900 mb-2">Assumption of Understanding</h4>
                      <p className="text-neutral-600 text-sm mb-2">You may not always check if others are following your thinking.</p>
                      <div className="text-xs text-orange-600 font-medium">Noted by 4/8 respondents</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Steps */}
          <div className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
              <Route className="text-secondary mr-3 w-6 h-6" />
              Your Growth Roadmap
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-secondary font-bold">1</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-3">This Week</h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  {reportData.actionSteps?.thisWeek?.map((step: string, index: number) => (
                    <li key={index}>• {step}</li>
                  )) || (
                    <>
                      <li>• Practice the "pause and check" technique in meetings</li>
                      <li>• Ask "What questions do you have?" after explaining concepts</li>
                      <li>• Schedule 15-min detail review sessions</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-secondary font-bold">2</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-3">This Month</h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  {reportData.actionSteps?.thisMonth?.map((step: string, index: number) => (
                    <li key={index}>• {step}</li>
                  )) || (
                    <>
                      <li>• Implement weekly team feedback sessions</li>
                      <li>• Partner with detail-oriented team members</li>
                      <li>• Practice active listening techniques</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-secondary font-bold">3</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-3">Next Quarter</h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  {reportData.actionSteps?.nextQuarter?.map((step: string, index: number) => (
                    <li key={index}>• {step}</li>
                  )) || (
                    <>
                      <li>• Develop structured communication frameworks</li>
                      <li>• Create systems for detail tracking</li>
                      <li>• Seek regular feedback on communication style</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4">
                <a href={`/api/surveys/${surveyId}/report/pdf`} download>
                  <Download className="mr-2 w-4 h-4" />
                  Download Full Report (PDF)
                </a>
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4">
                <Share className="mr-2 w-4 h-4" />
                Share with Coach/Mentor
              </Button>
              <Link href="/onboarding">
                <Button variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 px-8 py-4">
                  <RotateCcw className="mr-2 w-4 h-4" />
                  Start New Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
