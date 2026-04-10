import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedJobs, toggleSavedJob, getApplications, updateApplicationStatus } from '@/services/api';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Plus,
  Edit,
  Save,
  X,
  Bookmark,
  BookmarkX,
  ExternalLink,
  ClipboardList,
  Building,
  Loader2,
  ChevronDown,
  ChevronRight,
  Calendar,
  ArrowRight,
  Search,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

const STATUS_PIPELINE = [
  { key: 'applied', label: 'Applied', color: 'bg-blue-500', lightBg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  { key: 'screening', label: 'Screening', color: 'bg-cyan-500', lightBg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  { key: 'interview', label: 'Interview', color: 'bg-purple-500', lightBg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  { key: 'offer', label: 'Offer', color: 'bg-emerald-500', lightBg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  { key: 'accepted', label: 'Accepted', color: 'bg-green-600', lightBg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  { key: 'rejected', label: 'Rejected', color: 'bg-red-400', lightBg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200' },
  { key: 'withdrawn', label: 'Withdrawn', color: 'bg-amber-400', lightBg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
] as const;

const STATUS_OPTIONS = STATUS_PIPELINE.map((s) => s.key);

const getStatusMeta = (status: string) => STATUS_PIPELINE.find((s) => s.key === status) || STATUS_PIPELINE[0];

const Profile = () => {
  const { user, profile: authProfile, isLoading, updateProfile } = useAuth();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'saved' | 'applications'>('info');
  const [appFilter, setAppFilter] = useState<string>('all');

  // Profile form state
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    about: '',
    experience: [] as any[],
    education: [] as any[],
    skills: [] as { name: string; level: string }[],
    jobPreferences: {
      roles: [] as string[],
      locations: [] as string[],
      salary: '',
      workType: '',
      remote: '',
    },
    github: '',
    linkedin: '',
    portfolio: '',
  });
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Fetch saved jobs
  const { data: savedJobsData, isLoading: savedLoading } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: getSavedJobs,
    enabled: !!user,
  });

  // Fetch applications
  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
    enabled: !!user,
  });

  const savedJobs = savedJobsData?.data?.saved_jobs || [];
  const applications = applicationsData?.data?.applications || [];
  const filteredApps = appFilter === 'all' ? applications : applications.filter((a: any) => a.status === appFilter);

  // Load profile from auth context
  useEffect(() => {
    if (authProfile && !profileLoaded) {
      let initialDegree = authProfile.education || '';
      let initialInstitution = '';
      if (initialDegree.includes(' at ')) {
        [initialDegree, initialInstitution] = initialDegree.split(' at ');
      }

      setProfile({
        name: authProfile.full_name || user?.email?.split('@')[0] || 'User',
        title: authProfile.current_role || 'Professional',
        email: user?.email || '',
        phone: authProfile.phone || '',
        location: authProfile.location || '',
        about: authProfile.about || '',
        experience: authProfile.experience || [],
        education: authProfile.education
          ? [{ id: '1', degree: initialDegree, institution: initialInstitution, location: '', startDate: '', endDate: '' }]
          : [],
        skills: (authProfile.skills || []).map((skill) => ({ name: skill, level: 'intermediate' })),
        jobPreferences: {
          roles: authProfile.desired_roles || [],
          locations: authProfile.preferred_locations || [],
          salary:
            authProfile.salary_min && authProfile.salary_max
              ? `$${authProfile.salary_min.toLocaleString()} - $${authProfile.salary_max.toLocaleString()}`
              : 'Negotiable',
          workType: authProfile.job_type || 'fulltime',
          remote: authProfile.remote_preference || 'any',
        },
        github: authProfile.github_url || '',
        linkedin: authProfile.linkedin_url || '',
        portfolio: authProfile.portfolio_url || '',
      });
      setProfileLoaded(true);
    }
  }, [authProfile, user, profileLoaded]);

  // Save profile
  const handleSaveProfile = async () => {
    const updatedData: Partial<any> = {
      full_name: profile.name,
      current_role: profile.title,
      phone: profile.phone,
      location: profile.location,
      about: profile.about,
      experience: profile.experience,
      skills: profile.skills.map((s) => s.name),
      education:
        profile.education.length > 0
          ? `${profile.education[0].degree}${profile.education[0].institution ? ` at ${profile.education[0].institution}` : ''}`
          : '',
      github_url: profile.github,
      linkedin_url: profile.linkedin,
      portfolio_url: profile.portfolio,
    };
    const { error } = await updateProfile(updatedData);
    if (!error) setEditMode(false);
  };

  // Unsave a job
  const handleUnsaveJob = async (jobId: string) => {
    try {
      await toggleSavedJob(jobId, 'unsave');
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
      toast.success('Job removed from saved');
    } catch {
      toast.error('Failed to unsave job');
    }
  };

  // Update application status
  const handleStatusUpdate = async (appId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  // Helpers
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-cobalt-600';
      case 'intermediate': return 'bg-cobalt-700';
      case 'beginner': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSkillLevelWidth = (level: string) => {
    switch (level) {
      case 'expert': return 'w-full';
      case 'intermediate': return 'w-2/3';
      case 'beginner': return 'w-1/3';
      default: return 'w-0';
    }
  };

  // Skills management
  const handleAddSkill = (skillName: string) => {
    if (!skillName.trim()) return;
    if (profile.skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) return;
    setProfile({ ...profile, skills: [...profile.skills, { name: skillName, level: 'intermediate' }] });
  };

  const handleRemoveSkill = (skillName: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s.name !== skillName) });
  };

  const handleEditSkillLevel = (skillName: string, level: string) => {
    setProfile({ ...profile, skills: profile.skills.map((s) => (s.name === skillName ? { ...s, level } : s)) });
  };

  // Experience management
  const handleAddExperience = () => {
    setProfile({
      ...profile,
      experience: [{ id: Date.now().toString(), title: '', company: '', location: '', startDate: '', endDate: null, description: '' }, ...profile.experience],
    });
  };

  const handleEditExperience = (id: string, field: string, value: string) => {
    setProfile({ ...profile, experience: profile.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)) });
  };

  const handleRemoveExperience = (id: string) => {
    setProfile({ ...profile, experience: profile.experience.filter((exp) => exp.id !== id) });
  };

  // Education management
  const handleAddEducation = () => {
    setProfile({
      ...profile,
      education: [{ id: Date.now().toString(), degree: '', institution: '', location: '', startDate: '', endDate: '' }, ...profile.education],
    });
  };

  const handleEditEducation = (id: string, field: string, value: string) => {
    setProfile({ ...profile, education: profile.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)) });
  };

  const handleRemoveEducation = (id: string) => {
    setProfile({ ...profile, education: profile.education.filter((edu) => edu.id !== id) });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="cs-card rounded-xl p-8 mb-8 animate-pulse">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-cobalt-100" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-cobalt-100 rounded w-48" />
                  <div className="h-4 bg-cobalt-50 rounded w-32" />
                  <div className="h-3 bg-cobalt-50 rounded w-64" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Count apps by status
  const statusCounts: Record<string, number> = {};
  applications.forEach((a: any) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-cream-50 text-cobalt-900">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">

          {/* PROFILE HEADER */}
          <div className="cs-card rounded-xl p-6 md:p-8 mb-8 relative">
            <button
              onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
              className="absolute top-6 right-6 p-2 bg-cream-100 rounded-lg hover:bg-cream-200 transition-colors cursor-pointer"
            >
              {editMode ? <Save className="h-5 w-5 text-cobalt-500" /> : <Edit className="h-5 w-5 text-cobalt-600/70" />}
            </button>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cobalt-600 to-cobalt-800 flex items-center justify-center text-3xl font-bold">
                <span className="text-cream-50">{profile.name.charAt(0)}</span>
              </div>

              <div className="flex-1">
                {editMode ? (
                  <>
                    <input type="text" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-xl font-bold w-full mb-2" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    <input type="text" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-cobalt-600/70 w-full mb-4" value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{profile.name}</h1>
                    <h2 className="text-xl text-cobalt-600/70 mb-4">{profile.title}</h2>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-cobalt-600/70">
                    <Mail className="h-5 w-5 mr-2 text-cobalt-500" />
                    {editMode ? (
                      <input type="email" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 w-full" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    ) : (
                      <span>{profile.email}</span>
                    )}
                  </div>
                  <div className="flex items-center text-cobalt-600/70">
                    <Phone className="h-5 w-5 mr-2 text-cobalt-500" />
                    {editMode ? (
                      <input type="text" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 w-full" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                    ) : (
                      <span>{profile.phone || 'Not set'}</span>
                    )}
                  </div>
                  <div className="flex items-center text-cobalt-600/70">
                    <MapPin className="h-5 w-5 mr-2 text-cobalt-500" />
                    {editMode ? (
                      <input type="text" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 w-full" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                    ) : (
                      <span>{profile.location || 'Not set'}</span>
                    )}
                  </div>
                  {profile.github && (
                    <div className="flex items-center text-cobalt-600/70">
                      <Globe className="h-5 w-5 mr-2 text-cobalt-500" />
                      {editMode ? (
                        <input type="text" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 w-full" value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} />
                      ) : (
                        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-cobalt-500 transition-colors">GitHub</a>
                      )}
                    </div>
                  )}
                  {profile.linkedin && (
                    <div className="flex items-center text-cobalt-600/70">
                      <Globe className="h-5 w-5 mr-2 text-cobalt-500" />
                      {editMode ? (
                        <input type="text" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 w-full" value={profile.linkedin} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} />
                      ) : (
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cobalt-500 transition-colors">LinkedIn</a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mt-6 pt-6 border-t border-cobalt-100/40">
              <h3 className="text-lg font-semibold mb-3">About</h3>
              {editMode ? (
                <textarea className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 w-full h-32 resize-none" value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} />
              ) : (
                <p className="text-cobalt-600/70">{profile.about || 'No bio added yet.'}</p>
              )}
            </div>

            {editMode && (
              <div className="flex justify-end mt-6">
                <button onClick={() => setEditMode(false)} className="px-4 py-2 border border-cobalt-100/40 rounded-lg text-cobalt-600/70 hover:bg-cream-50 transition-colors mr-3 cursor-pointer">Cancel</button>
                <button onClick={handleSaveProfile} className="px-4 py-2 bg-gradient-to-r from-cobalt-600 to-cobalt-800 hover:from-cobalt-700 hover:to-cobalt-900 text-white rounded-lg transition-all duration-300 cursor-pointer">Save Changes</button>
              </div>
            )}
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex border-b border-cobalt-100/40 mb-8">
            {([
              { key: 'info', label: 'Profile Info', icon: User },
              { key: 'saved', label: `Saved Jobs (${savedJobs.length})`, icon: Bookmark },
              { key: 'applications', label: `Applications (${applications.length})`, icon: ClipboardList },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                className={`pb-3 px-5 font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${activeTab === tab.key ? 'text-cobalt-600 border-b-2 border-cobalt-600' : 'text-cobalt-400 hover:text-cobalt-600'}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ═══════════════ INFO TAB ═══════════════ */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Experience */}
                <div className="cs-glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Experience</h2>
                    {editMode && (
                      <button onClick={handleAddExperience} className="p-2 bg-cream-100 rounded-lg hover:bg-cream-200 transition-colors cursor-pointer">
                        <Plus className="h-5 w-5 text-cobalt-500" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-6">
                    {profile.experience.map((exp) => (
                      <div key={exp.id} className="relative p-4 border border-transparent hover:border-cobalt-100/20 rounded-lg transition-all">
                        {editMode && (
                          <div className="absolute -right-2 -top-2 z-10">
                            <button onClick={() => handleRemoveExperience(exp.id)} className="p-1.5 bg-white rounded-full border border-red-100 hover:bg-red-50 transition-colors cursor-pointer">
                              <X className="h-3.5 w-3.5 text-red-400" />
                            </button>
                          </div>
                        )}
                        {editMode ? (
                          <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input type="text" placeholder="Job Title" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full" value={exp.title} onChange={(e) => handleEditExperience(exp.id, 'title', e.target.value)} />
                              <input type="text" placeholder="Company" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full" value={exp.company} onChange={(e) => handleEditExperience(exp.id, 'company', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <input type="text" placeholder="Start Date" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full" value={exp.startDate} onChange={(e) => handleEditExperience(exp.id, 'startDate', e.target.value)} />
                              <input type="text" placeholder="End Date (or Present)" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full" value={exp.endDate || ''} onChange={(e) => handleEditExperience(exp.id, 'endDate', e.target.value)} />
                              <input type="text" placeholder="Location" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full" value={exp.location} onChange={(e) => handleEditExperience(exp.id, 'location', e.target.value)} />
                            </div>
                            <textarea placeholder="Description" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full h-24 resize-none" value={exp.description} onChange={(e) => handleEditExperience(exp.id, 'description', e.target.value)} />
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <div className="h-12 w-12 rounded-lg bg-cream-100 flex items-center justify-center text-lg font-semibold mr-4 flex-shrink-0">
                              {exp.company?.charAt(0) || 'J'}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">{exp.title || 'Untitled Role'}</h3>
                              <p className="text-cobalt-600/70">{exp.company || 'Unknown Company'} &bull; {exp.location || 'Remote'}</p>
                              <p className="text-sm text-cobalt-500 mt-1">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                              {exp.description && <p className="mt-3 text-cobalt-600/70">{exp.description}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {profile.experience.length === 0 && !editMode && (
                      <p className="text-center text-cobalt-500 py-4 italic">No experience added yet.</p>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="cs-glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Education</h2>
                    {editMode && (
                      <button onClick={handleAddEducation} className="p-2 bg-cream-100 rounded-lg hover:bg-cream-200 transition-colors cursor-pointer">
                        <Plus className="h-5 w-5 text-cobalt-500" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-6">
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="relative p-4 border border-transparent hover:border-cobalt-100/20 rounded-lg transition-all">
                        {editMode && (
                          <div className="absolute -right-2 -top-2 z-10">
                            <button onClick={() => handleRemoveEducation(edu.id)} className="p-1.5 bg-white rounded-full border border-red-100 hover:bg-red-50 transition-colors cursor-pointer">
                              <X className="h-3.5 w-3.5 text-red-400" />
                            </button>
                          </div>
                        )}
                        {editMode ? (
                          <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input type="text" placeholder="Degree" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full" value={edu.degree} onChange={(e) => handleEditEducation(edu.id, 'degree', e.target.value)} />
                              <input type="text" placeholder="Institution" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full" value={edu.institution} onChange={(e) => handleEditEducation(edu.id, 'institution', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input type="text" placeholder="Start Date" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full" value={edu.startDate} onChange={(e) => handleEditEducation(edu.id, 'startDate', e.target.value)} />
                              <input type="text" placeholder="End Date" className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full" value={edu.endDate} onChange={(e) => handleEditEducation(edu.id, 'endDate', e.target.value)} />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <div className="h-12 w-12 rounded-lg bg-cream-100 flex items-center justify-center mr-4 flex-shrink-0">
                              <GraduationCap className="h-6 w-6 text-cobalt-600/70" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">{edu.degree || 'Degree Unknown'}</h3>
                              <p className="text-cobalt-600/70">{edu.institution || 'Institution Unknown'}</p>
                              <p className="text-sm text-cobalt-500 mt-1">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {profile.education.length === 0 && !editMode && (
                      <p className="text-center text-cobalt-500 py-4 italic">No education added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar: Skills + Preferences */}
              <div className="space-y-8">
                {/* Skills */}
                <div className="cs-glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Skills</h2>
                    {editMode && (
                      <input
                        type="text"
                        placeholder="Add skill..."
                        className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 text-xs w-28 focus:w-40 transition-all duration-300 outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSkill((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    {profile.skills.map((skill) => (
                      <div key={skill.name} className="relative group">
                        {editMode && (
                          <button onClick={() => handleRemoveSkill(skill.name)} className="absolute -right-2 -top-2 p-1 bg-white rounded-full border border-red-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <X className="h-3 w-3 text-red-500" />
                          </button>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium">{skill.name}</h3>
                          {editMode ? (
                            <select className="text-[10px] bg-transparent outline-none border-b border-cobalt-100/50 cursor-pointer" value={skill.level} onChange={(e) => handleEditSkillLevel(skill.name, e.target.value)}>
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="expert">Expert</option>
                            </select>
                          ) : (
                            <span className="text-xs text-cobalt-500 capitalize">{skill.level}</span>
                          )}
                        </div>
                        <div className="w-full bg-cream-100 rounded-full h-1.5">
                          <div className={`${getSkillLevelColor(skill.level)} h-1.5 rounded-full ${getSkillLevelWidth(skill.level)} transition-all duration-500`} />
                        </div>
                      </div>
                    ))}
                    {profile.skills.length === 0 && <p className="text-xs text-cobalt-400 italic">No skills added yet.</p>}
                  </div>
                </div>

                {/* Job Preferences */}
                <div className="cs-glass rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Job Preferences</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-cobalt-500">Desired Roles</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {profile.jobPreferences.roles.length > 0 ? profile.jobPreferences.roles.map((r) => (
                          <span key={r} className="px-2 py-0.5 bg-cobalt-50 text-cobalt-600 rounded text-xs">{r}</span>
                        )) : <span className="text-cobalt-400 text-xs">Not set</span>}
                      </div>
                    </div>
                    <div>
                      <span className="text-cobalt-500">Preferred Locations</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {profile.jobPreferences.locations.length > 0 ? profile.jobPreferences.locations.map((l) => (
                          <span key={l} className="px-2 py-0.5 bg-cobalt-50 text-cobalt-600 rounded text-xs">{l}</span>
                        )) : <span className="text-cobalt-400 text-xs">Not set</span>}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cobalt-500">Salary</span>
                      <span className="text-cobalt-700 font-medium">{profile.jobPreferences.salary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cobalt-500">Work Type</span>
                      <span className="text-cobalt-700 font-medium capitalize">{profile.jobPreferences.workType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cobalt-500">Remote</span>
                      <span className="text-cobalt-700 font-medium capitalize">{profile.jobPreferences.remote}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ SAVED JOBS TAB ═══════════════ */}
          {activeTab === 'saved' && (
            <div className="cs-glass rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">Saved Jobs</h2>

              {savedLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-cobalt-500" />
                </div>
              ) : savedJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-cobalt-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-cobalt-600 mb-1">No saved jobs yet</h3>
                  <p className="text-cobalt-400 text-sm">Jobs you save from Search will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedJobs.map((saved: any) => {
                    const job = saved.job_data || {};
                    return (
                      <div key={saved._id} className="flex items-center justify-between p-4 bg-white border border-cobalt-100/40 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-cobalt-50 flex items-center justify-center text-cobalt-500 mr-4 flex-shrink-0">
                            <Building className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium truncate">{job.role || job.title || 'Untitled Job'}</h3>
                            <p className="text-sm text-cobalt-500 truncate">{job.company || 'Unknown'} {job.location ? `\u2022 ${job.location}` : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          {(job.apply_link || job.job_url) && (
                            <a href={job.apply_link || job.job_url} target="_blank" rel="noopener noreferrer" className="p-2 text-cobalt-500 hover:bg-cobalt-50 rounded-lg transition-colors cursor-pointer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button onClick={() => handleUnsaveJob(saved.job_id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Remove from saved">
                            <BookmarkX className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ APPLICATIONS TAB ═══════════════ */}
          {activeTab === 'applications' && (
            <div className="space-y-6">

              {/* Pipeline Overview */}
              {applications.length > 0 && (
                <div className="bg-white rounded-xl border border-cobalt-100/50 p-5">
                  <h3 className="text-sm font-semibold text-cobalt-700 mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" /> Application Pipeline
                  </h3>
                  <div className="flex items-center gap-1 overflow-x-auto pb-2">
                    {STATUS_PIPELINE.slice(0, 5).map((status, i) => {
                      const count = statusCounts[status.key] || 0;
                      return (
                        <div key={status.key} className="flex items-center">
                          <button
                            onClick={() => setAppFilter(appFilter === status.key ? 'all' : status.key)}
                            className={`flex flex-col items-center px-4 py-3 rounded-lg min-w-[90px] transition-all cursor-pointer ${appFilter === status.key
                              ? `${status.lightBg} ${status.border} border-2`
                              : 'hover:bg-cream-50 border-2 border-transparent'
                              }`}
                          >
                            <span className={`text-2xl font-bold ${status.text}`}>{count}</span>
                            <span className="text-xs text-cobalt-500 mt-0.5">{status.label}</span>
                          </button>
                          {i < 4 && <ChevronRight className="h-4 w-4 text-cobalt-300 mx-1 flex-shrink-0" />}
                        </div>
                      );
                    })}
                    {/* Rejected/Withdrawn counts */}
                    <div className="ml-auto flex items-center gap-2 pl-4 border-l border-cobalt-100/40">
                      {STATUS_PIPELINE.slice(5).map((status) => {
                        const count = statusCounts[status.key] || 0;
                        if (count === 0) return null;
                        return (
                          <button key={status.key}
                            onClick={() => setAppFilter(appFilter === status.key ? 'all' : status.key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${appFilter === status.key ? `${status.lightBg} ${status.text}` : 'text-cobalt-400 hover:text-cobalt-600'}`}>
                            {count} {status.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {appFilter !== 'all' && (
                    <button onClick={() => setAppFilter('all')} className="text-xs text-cobalt-400 hover:text-cobalt-600 mt-2 cursor-pointer">
                      Clear filter
                    </button>
                  )}
                </div>
              )}

              {/* Application Cards */}
              <div className="cs-glass rounded-xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {appFilter === 'all' ? 'All Applications' : `${getStatusMeta(appFilter).label} (${filteredApps.length})`}
                  </h2>
                </div>

                {appsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-cobalt-500" />
                  </div>
                ) : filteredApps.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 text-cobalt-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-cobalt-600 mb-1">
                      {applications.length === 0 ? 'No applications yet' : 'No applications in this status'}
                    </h3>
                    <p className="text-cobalt-400 text-sm">
                      {applications.length === 0 ? 'When you apply to jobs, they\'ll appear here for tracking.' : 'Try selecting a different status filter.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredApps.map((app: any) => {
                      const job = app.job_data || {};
                      const statusMeta = getStatusMeta(app.status);
                      return (
                        <div key={app._id} className={`p-4 bg-white border rounded-xl hover:shadow-md transition-all ${statusMeta.border}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center min-w-0">
                              <div className={`h-10 w-10 rounded-lg ${statusMeta.lightBg} flex items-center justify-center mr-4 flex-shrink-0`}>
                                <Briefcase className={`h-5 w-5 ${statusMeta.text}`} />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold truncate">{job.role || job.title || 'Untitled Job'}</h3>
                                <p className="text-sm text-cobalt-500 truncate">{job.company || 'Unknown'} {job.location ? `\u2022 ${job.location}` : ''}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-cobalt-400 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> Applied {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                  {job.match_score && (
                                    <span className="text-xs text-cobalt-500 font-medium">{job.match_score}% match</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {(job.apply_link || job.job_url) && (
                                <a href={job.apply_link || job.job_url} target="_blank" rel="noopener noreferrer" className="p-2 text-cobalt-500 hover:bg-cobalt-50 rounded-lg transition-colors cursor-pointer" title="View job">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                              <div className="relative">
                                <select
                                  value={app.status}
                                  onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                  className={`appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-lg border-2 cursor-pointer transition-all ${statusMeta.lightBg} ${statusMeta.text} ${statusMeta.border}`}
                                >
                                  {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s} className="bg-white text-cobalt-900">
                                      {getStatusMeta(s).label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none ${statusMeta.text}`} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
