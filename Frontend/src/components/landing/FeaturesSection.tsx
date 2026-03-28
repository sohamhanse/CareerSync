
import { Link } from 'react-router-dom';
import { Search, Brain, BarChart2, Bell, ChevronRight, LucideProps } from 'lucide-react';
import FeatureCard from '../FeatureCard';

// Custom icons for feature cards
const AggregationIcon = (props: LucideProps) => (
  <Search {...props} className="h-6 w-6 text-white" />
);

const AIIcon = (props: LucideProps) => (
  <Brain {...props} className="h-6 w-6 text-white" />
);

const TrackerIcon = (props: LucideProps) => (
  <BarChart2 {...props} className="h-6 w-6 text-white" />
);

const AlertsIcon = (props: LucideProps) => (
  <Bell {...props} className="h-6 w-6 text-white" />
);

const FeaturesSection = () => {
  return (
    <section id="features-section" className="py-24 relative bg-cream-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cobalt-400/50"></div>
            <h2 className="mx-4 text-sm uppercase tracking-wider text-cobalt-500 font-semibold">Features</h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cobalt-400/50"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-cobalt-900">
            Modern Tools for the Modern <span className="text-gradient">Job Seeker</span>
          </h2>
          <p className="text-cobalt-700/60 text-lg leading-relaxed">
            CareerSync combines cutting-edge technology with intuitive design to streamline 
            every aspect of your job search journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<AggregationIcon />}
            title="Job Aggregation"
            description="Search thousands of jobs from hundreds of sources in one place, saving you time and effort."
            gradient="blue"
            delay={100}
            link="/features/job-aggregation"
          />
          <FeatureCard
            icon={<AIIcon />}
            title="AI Recommendations"
            description="Get personalized job recommendations based on your skills, experience, and preferences."
            gradient="purple"
            delay={200}
            link="/features/ai-recommendations"
          />
          <FeatureCard
            icon={<TrackerIcon />}
            title="Application Tracker"
            description="Keep track of all your applications in one place with our intuitive kanban board."
            gradient="mixed"
            delay={300}
            link="/features/application-tracker"
          />
          <FeatureCard
            icon={<AlertsIcon />}
            title="Real-time Alerts"
            description="Receive notifications about new job postings, application updates, and interview reminders."
            gradient="blue"
            delay={400}
            link="/features/real-time-alerts"
          />
        </div>
        
        <div className="text-center">
          <Link 
            to="/search" 
            className="inline-flex items-center text-cobalt-600 font-medium hover:text-cobalt-800 transition-colors group"
          >
            Explore all features
            <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
