
import { Brain, Target, Sparkles, Zap, UserCheck, Shield, Award } from 'lucide-react';
import FeatureLayout from '@/components/FeatureLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AIRecommendations = () => {
  return (
    <FeatureLayout
      title="AI Recommendations"
      description="Get personalized job recommendations based on your skills, experience, and preferences."
      icon={<Brain className="h-8 w-8 text-cobalt-900" />}
      gradient="purple"
    >
      <div className="max-w-4xl mx-auto">
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-cream-50 border-cobalt-100/40 text-cobalt-900">
              <CardHeader>
                <UserCheck className="h-10 w-10 text-purple-400 mb-3" />
                <CardTitle>Skills Analysis</CardTitle>
                <CardDescription className="text-cobalt-600/70">
                  Our AI analyzes your resume and profile to understand your skills, experience, and career trajectory.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-cream-50 border-cobalt-100/40 text-cobalt-900">
              <CardHeader>
                <Target className="h-10 w-10 text-purple-400 mb-3" />
                <CardTitle>Job Matching</CardTitle>
                <CardDescription className="text-cobalt-600/70">
                  We match your profile with thousands of job listings to find opportunities that align with your expertise.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-cream-50 border-cobalt-100/40 text-cobalt-900">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-purple-400 mb-3" />
                <CardTitle>Continuous Learning</CardTitle>
                <CardDescription className="text-cobalt-600/70">
                  Our system learns from your feedback to continuously improve recommendation quality.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
          <div className="space-y-6">
            <div className="cs-card rounded-xl p-6">
              <div className="flex items-start mb-4">
                <div className="bg-purple-500/20 rounded-lg p-2 mr-4">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Skill Gap Analysis</h3>
                  <p className="text-cobalt-600/70">
                    Identify skills you need to develop for your dream role with our gap analysis tool, which compares your profile against job requirements.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="cs-card rounded-xl p-6">
              <div className="flex items-start mb-4">
                <div className="bg-purple-500/20 rounded-lg p-2 mr-4">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Career Path Suggestions</h3>
                  <p className="text-cobalt-600/70">
                    Explore potential career paths and progression opportunities based on your current skill set and experience level.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="cs-card rounded-xl p-6">
              <div className="flex items-start mb-4">
                <div className="bg-purple-500/20 rounded-lg p-2 mr-4">
                  <Award className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Opportunity Scoring</h3>
                  <p className="text-cobalt-600/70">
                    Each job recommendation comes with a match score, showing how well it aligns with your profile and preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Discover Your Perfect Career Match</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-cobalt-900">
              <Link to="/dashboard">View Recommendations</Link>
            </Button>
            <Button asChild variant="outline" className="border-cobalt-100/40 hover:bg-cream-100">
              <Link to="/profile">Complete Your Profile</Link>
            </Button>
          </div>
        </section>
      </div>
    </FeatureLayout>
  );
};

export default AIRecommendations;
