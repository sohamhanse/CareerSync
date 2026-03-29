import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
  Loader2,
  Sparkles,
  Calendar,
  Clock3,
  Plus,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  X,
  AlertCircle,
  MessageCircle,
  Mail
} from 'lucide-react';

// Mock application data
const applications = [
  {
    id: '1',
    company: 'TechCorp Solutions',
    position: 'Senior Frontend Developer',
    status: 'interview',
    appliedDate: '2023-05-15',
  },
  {
    id: '2',
    company: 'InnovateTech',
    position: 'Full Stack Engineer',
    status: 'applied',
    appliedDate: '2023-05-18',
  },
  {
    id: '3',
    company: 'DesignWorks Agency',
    position: 'Product Designer',
    status: 'offered',
    appliedDate: '2023-05-05',
  },
];

// Mock upcoming events
const upcomingEvents = [
  {
    id: '1',
    title: 'Interview with TechCorp Solutions',
    time: '2023-05-30T14:00:00',
    type: 'interview',
  },
  {
    id: '2',
    title: 'Follow-up with DesignWorks Agency',
    time: '2023-05-29T11:00:00',
    type: 'follow-up',
  },
];

// Mock skills
const inDemandSkills = [
  { name: 'React', growth: 24, level: 'expert' },
  { name: 'TypeScript', growth: 32, level: 'intermediate' },
  { name: 'Node.js', growth: 18, level: 'intermediate' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const recLoading = false;
  const recommendedJobs: any[] = [];
  const needsProfile = false;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-50 text-blue-600';
      case 'interview': return 'bg-purple-50 text-purple-600';
      case 'offered': return 'bg-green-50 text-green-600';
      case 'rejected': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Mail className="h-4 w-4" />;
      case 'interview': return <MessageCircle className="h-4 w-4" />;
      case 'offered': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'interview': return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case 'follow-up': return <Mail className="h-5 w-5 text-cobalt-500" />;
      default: return <Calendar className="h-5 w-5 text-cobalt-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 text-cobalt-900">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-cobalt-600/60">
              Track your applications and recommendations
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-8">
            {['overview', 'applications', 'recommendations'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 pb-3 ${activeTab === tab
                  ? 'border-b-2 border-cobalt-600 text-cobalt-600'
                  : 'text-cobalt-400'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">

              {/* Applications */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>

                {applications.map(app => (
                  <div key={app.id} className="flex justify-between py-2">
                    <div>
                      <p className="font-medium">{app.position}</p>
                      <p className="text-sm text-cobalt-500">{app.company}</p>
                    </div>

                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)} {app.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Events */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>

                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex gap-3 mb-3">
                    {getEventIcon(event.type)}
                    <div>
                      <p>{event.title}</p>
                      <p className="text-sm text-cobalt-500">
                        {formatDate(event.time)} • {formatTime(event.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Jobs */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Recommended Jobs</h2>

                {needsProfile && (
                  <Link to="/onboarding" className="block mb-4 text-cobalt-600">
                    Complete profile for better recommendations →
                  </Link>
                )}

                {recLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  recommendedJobs.slice(0, 3).map((job: any) => (
                    <div key={job.job_id} className="py-2 border-b">
                      <p className="font-medium">{job.job_title}</p>
                      <p className="text-sm text-cobalt-500">{job.company_name}</p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* OTHER TABS */}
          {activeTab !== 'overview' && (
            <div className="text-center p-10 bg-white rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">
                {activeTab} coming soon
              </h2>

              <button
                onClick={() => setActiveTab('overview')}
                className="cs-btn-primary mt-4 px-5 py-2 rounded-lg"
              >
                Back
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;