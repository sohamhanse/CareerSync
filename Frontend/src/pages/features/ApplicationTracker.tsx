
import { BarChart2, Kanban, Calendar, File, CheckSquare, ClipboardList, RefreshCw } from 'lucide-react';
import FeatureLayout from '@/components/FeatureLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ApplicationTracker = () => {
  return (
    <FeatureLayout
      title="Application Tracker"
      description="Keep track of all your applications in one place with our intuitive kanban board."
      icon={<BarChart2 className="h-8 w-8 text-cobalt-900" />}
      gradient="mixed"
    >
      <div className="max-w-4xl mx-auto">
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-cream-50 border-cobalt-100/40 text-cobalt-900">
              <CardHeader>
                <Kanban className="h-10 w-10 text-cobalt-500 mb-3" />
                <CardTitle>Kanban Organization</CardTitle>
                <CardDescription className="text-cobalt-600/70">
                  Visualize your job applications in stages like Applied, Interviewing, Offered, and Rejected.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-cream-50 border-cobalt-100/40 text-cobalt-900">
              <CardHeader>
                <Calendar className="h-10 w-10 text-cobalt-500 mb-3" />
                <CardTitle>Timeline Tracking</CardTitle>
                <CardDescription className="text-cobalt-600/70">
                  Track important dates like application deadlines, interview schedules, and follow-up reminders.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-cream-50 border-cobalt-100/40 text-cobalt-900">
              <CardHeader>
                <File className="h-10 w-10 text-cobalt-500 mb-3" />
                <CardTitle>Document Storage</CardTitle>
                <CardDescription className="text-cobalt-600/70">
                  Store resumes, cover letters, and other application materials for each job in one place.
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
                <div className="bg-gradient-to-br from-electric-500/20 to-purple-500/20 rounded-lg p-2 mr-4">
                  <CheckSquare className="h-6 w-6 text-cobalt-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Status Updates</h3>
                  <p className="text-cobalt-600/70">
                    Easily update the status of your applications as you progress through the hiring process, from application to offer.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="cs-card rounded-xl p-6">
              <div className="flex items-start mb-4">
                <div className="bg-gradient-to-br from-electric-500/20 to-purple-500/20 rounded-lg p-2 mr-4">
                  <ClipboardList className="h-6 w-6 text-cobalt-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Application Notes</h3>
                  <p className="text-cobalt-600/70">
                    Add personal notes for each application, such as interview feedback, key contacts, or follow-up details.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="cs-card rounded-xl p-6">
              <div className="flex items-start mb-4">
                <div className="bg-gradient-to-br from-electric-500/20 to-purple-500/20 rounded-lg p-2 mr-4">
                  <RefreshCw className="h-6 w-6 text-cobalt-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Application Analytics</h3>
                  <p className="text-cobalt-600/70">
                    Get insights into your job search with metrics on application response rates, interview conversion, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Ready to Organize Your Job Search?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-gradient-to-r from-cobalt-600 to-cobalt-800 hover:from-electric-600 hover:to-purple-600 text-cobalt-900">
              <Link to="/applications">Manage Applications</Link>
            </Button>
            <Button asChild variant="outline" className="border-cobalt-100/40 hover:bg-cream-100">
              <Link to="/auth/register">Create an Account</Link>
            </Button>
          </div>
        </section>
      </div>
    </FeatureLayout>
  );
};

export default ApplicationTracker;
