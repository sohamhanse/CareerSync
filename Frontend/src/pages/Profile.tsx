import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Plus,
  Edit,
  Save,
  X,
  FileText,
  Upload,
  Check,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Heart,
  Settings
} from 'lucide-react';

// ### MOCK DATA FOR APPLICATIONS AND SAVED JOBS ###
const mockAppliedJobs = [
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

const mockSavedJobs = [
  {
    id: 's1',
    company: 'Google',
    position: 'Senior Software Engineer',
    location: 'Mountain View, CA',
    salary: '$180k - $250k',
  },
  {
    id: 's2',
    company: 'Meta',
    position: 'Frontend Lead',
    location: 'Menlo Park, CA',
    salary: '$170k - $230k',
  },
];

const Profile = () => {
  const { user, profile: authProfile, isLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  // User profile state
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
      remote: ''
    },
    resumeUrl: null as string | null,
    github: '',
    linkedin: '',
    portfolio: ''
  });

  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (authProfile && !profileLoaded) {
      // Split education string into degree and institution if possible
      let initialDegree = authProfile.education || '';
      let initialInstitution = 'Institution';
      if (initialDegree.includes(' at ')) {
        [initialDegree, initialInstitution] = initialDegree.split(' at ');
      }

      setProfile({
        name: authProfile.full_name || user?.email?.split('@')[0] || 'User',
        title: authProfile.current_role || 'Professional',
        email: user?.email || '',
        phone: authProfile.phone || '',
        location: authProfile.location || '',
        // Use persistent backend field or default empty
        about: authProfile.about || '',
        // Use persistent backend array directly
        experience: authProfile.experience || [],
        education: authProfile.education ? [
          {
            id: '1',
            degree: initialDegree,
            institution: initialInstitution,
            location: '',
            startDate: '',
            endDate: ''
          }
        ] : [],
        skills: (authProfile.skills || []).map(skill => ({ name: skill, level: 'intermediate' })),
        jobPreferences: {
          roles: authProfile.desired_roles || [],
          locations: authProfile.preferred_locations || [],
          salary: authProfile.salary_min && authProfile.salary_max
            ? `$${authProfile.salary_min.toLocaleString()} - $${authProfile.salary_max.toLocaleString()}`
            : authProfile.salary_min ? `From $${authProfile.salary_min.toLocaleString()}` : 'Negotiable',
          workType: authProfile.job_type || 'fulltime',
          remote: authProfile.remote_preference || 'any'
        },
        resumeUrl: null,
        github: authProfile.github_url || '',
        linkedin: authProfile.linkedin_url || '',
        portfolio: authProfile.portfolio_url || ''
      });
      setProfileLoaded(true);
    }
  }, [authProfile, user, profileLoaded]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cobalt-600"></div>
      </div>
    );
  }

  // ### HELPER: FORMAT DATE ###
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const { updateProfile } = useAuth();

  // ### FEATURE: SAVE PROFILE ###
  const handleSaveProfile = async () => {
    const updatedData: Partial<any> = {
      full_name: profile.name,
      current_role: profile.title,
      phone: profile.phone,
      location: profile.location,
      about: profile.about,
      experience: profile.experience,
      skills: profile.skills.map(s => s.name),
      // We save the first education entry's degree and institution back to the backend string
      education: profile.education.length > 0
        ? `${profile.education[0].degree}${profile.education[0].institution ? ` at ${profile.education[0].institution}` : ''}`
        : '',
      github_url: profile.github,
      linkedin_url: profile.linkedin,
      portfolio_url: profile.portfolio
    };

    const { error } = await updateProfile(updatedData);
    if (!error) {
      setEditMode(false);
    }
  };

  // ### FEATURE: RESUME UPLOAD ###
  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfile({
        ...profile,
        resumeUrl: file.name
      });
    }
  };

  // ### SKILLS MANAGEMENT ###
  const handleAddSkill = (skillName: string) => {
    if (!skillName.trim()) return;
    if (profile.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) return;
    setProfile({
      ...profile,
      skills: [...profile.skills, { name: skillName, level: 'intermediate' }]
    });
  };

  const handleRemoveSkill = (skillName: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s.name !== skillName)
    });
  };

  const handleEditSkillLevel = (skillName: string, level: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.map(s => s.name === skillName ? { ...s, level } : s)
    });
  };

  // ### EDUCATION MANAGEMENT ###
  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: ''
    };
    setProfile({
      ...profile,
      education: [newEdu, ...profile.education]
    });
  };

  const handleEditEducation = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      education: profile.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const handleRemoveEducation = (id: string) => {
    setProfile({
      ...profile,
      education: profile.education.filter(edu => edu.id !== id)
    });
  };

  // ### EXPERIENCE MANAGEMENT ###
  const handleAddExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: null,
      description: ''
    };
    setProfile({
      ...profile,
      experience: [newExp, ...profile.experience]
    });
  };

  const handleEditExperience = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      experience: profile.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const handleRemoveExperience = (id: string) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter(exp => exp.id !== id)
    });
  };

  // ### UI HELPERS: SKILLS ###
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-cobalt-600';
      case 'intermediate':
        return 'bg-cobalt-700';
      case 'beginner':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSkillLevelWidth = (level: string) => {
    switch (level) {
      case 'expert':
        return 'w-full';
      case 'intermediate':
        return 'w-2/3';
      case 'beginner':
        return 'w-1/3';
      default:
        return 'w-0';
    }
  };

  // ### UI HELPERS: STATUS COLORS ###
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-50 text-blue-600';
      case 'interview': return 'bg-purple-50 text-purple-600';
      case 'offered': return 'bg-green-50 text-green-600';
      case 'rejected': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 text-cobalt-900">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* ### PROFILE HEADER SECTION ### */}
          <div className="cs-card rounded-xl p-6 md:p-8 mb-8 relative">
            {/* Edit button */}
            <button
              onClick={() => setEditMode(!editMode)}
              className="absolute top-6 right-6 p-2 bg-cream-100 rounded-lg hover:bg-cream-200 transition-colors"
            >
              {editMode ? (
                <Save className="h-5 w-5 text-cobalt-500" />
              ) : (
                <Edit className="h-5 w-5 text-cobalt-600/70" />
              )}
            </button>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Profile Image */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cobalt-600 to-cobalt-800 flex items-center justify-center text-3xl font-bold">
                <span className="text-cream-50">
                  {profile.name.charAt(0)}
                </span>
                {editMode && (
                  <button className="absolute -right-2 -bottom-2 p-1.5 bg-navy-800 rounded-full border border-cobalt-100/40">
                    <Edit className="h-4 w-4 text-cobalt-600/70" />
                  </button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {editMode ? (
                  <input
                    type="text"
                    className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-xl font-bold w-full mb-2"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{profile.name}</h1>
                )}

                {editMode ? (
                  <input
                    type="text"
                    className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-cobalt-600/70 w-full mb-4"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  />
                ) : (
                  <h2 className="text-xl text-cobalt-600/70 mb-4">{profile.title}</h2>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-cobalt-600/70">
                    <Mail className="h-5 w-5 mr-2 text-cobalt-500" />
                    {editMode ? (
                      <input
                        type="email"
                        className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 w-full"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    ) : (
                      <span>{profile.email}</span>
                    )}
                  </div>

                  <div className="flex items-center text-cobalt-600/70">
                    <Phone className="h-5 w-5 mr-2 text-cobalt-500" />
                    {editMode ? (
                      <input
                        type="text"
                        className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 w-full"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    ) : (
                      <span>{profile.phone}</span>
                    )}
                  </div>

                  <div className="flex items-center text-cobalt-600/70">
                    <MapPin className="h-5 w-5 mr-2 text-cobalt-500" />
                    {editMode ? (
                      <input
                        type="text"
                        className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 w-full"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    ) : (
                      <span>{profile.location}</span>
                    )}
                  </div>

                  {profile.github && (
                    <div className="flex items-center text-cobalt-600/70">
                      <Globe className="h-5 w-5 mr-2 text-cobalt-500" />
                      {editMode ? (
                        <input
                          type="text"
                          className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 w-full"
                          value={profile.github}
                          placeholder="GitHub URL"
                          onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                        />
                      ) : (
                        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-cobalt-500 transition-colors">GitHub</a>
                      )}
                    </div>
                  )}

                  {profile.linkedin && (
                    <div className="flex items-center text-cobalt-600/70">
                      <Globe className="h-5 w-5 mr-2 text-cobalt-500" />
                      {editMode ? (
                        <input
                          type="text"
                          className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 w-full"
                          value={profile.linkedin}
                          placeholder="LinkedIn URL"
                          onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                        />
                      ) : (
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cobalt-500 transition-colors">LinkedIn</a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About section */}
            <div className="mt-6 pt-6 border-t border-cobalt-100/40">
              <h3 className="text-lg font-semibold mb-3">About</h3>
              {editMode ? (
                <textarea
                  className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 w-full h-32 resize-none"
                  value={profile.about}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                />
              ) : (
                <p className="text-cobalt-600/70">{profile.about}</p>
              )}
            </div>

            {/* Save Profile Button */}
            {editMode && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-cobalt-100/40 rounded-lg text-cobalt-600/70 hover:bg-cream-50 transition-colors mr-3"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-gradient-to-r from-cobalt-600 to-cobalt-800 hover:from-electric-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* ### TAB NAVIGATION ### */}
          <div className="flex border-b border-cobalt-100/40 mb-8 overflow-x-auto no-scrollbar">
            <button
              className={`pb-3 px-4 font-medium text-sm whitespace-nowrap ${activeSection === 'profile' ? 'text-cobalt-500 border-b-2 border-electric-400' : 'text-cobalt-500'}`}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
            <button
              className={`pb-3 px-4 font-medium text-sm whitespace-nowrap ${activeSection === 'resume' ? 'text-cobalt-500 border-b-2 border-electric-400' : 'text-cobalt-500'}`}
              onClick={() => setActiveSection('resume')}
            >
              Resume
            </button>
            <button
              className={`pb-3 px-4 font-medium text-sm whitespace-nowrap ${activeSection === 'applied' ? 'text-cobalt-500 border-b-2 border-electric-400' : 'text-cobalt-500'}`}
              onClick={() => setActiveSection('applied')}
            >
              Applied Jobs
            </button>
            <button
              className={`pb-3 px-4 font-medium text-sm whitespace-nowrap ${activeSection === 'saved' ? 'text-cobalt-500 border-b-2 border-electric-400' : 'text-cobalt-500'}`}
              onClick={() => setActiveSection('saved')}
            >
              Saved Jobs
            </button>
            <button
              className={`pb-3 px-4 font-medium text-sm whitespace-nowrap ${activeSection === 'settings' ? 'text-cobalt-500 border-b-2 border-electric-400' : 'text-cobalt-500'}`}
              onClick={() => setActiveSection('settings')}
            >
              Settings
            </button>
          </div>

          {/* ### SECTION CONTENT AREA ### */}

          {/* --- PROFILE TAB --- */}
          {activeSection === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Experience section */}
                <div className="cs-glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Experience</h2>
                    {editMode && (
                      <button
                        onClick={handleAddExperience}
                        className="p-2 bg-cream-100 rounded-lg hover:bg-cream-200 transition-colors"
                      >
                        <Plus className="h-5 w-5 text-cobalt-500" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-6">
                    {profile.experience.map((exp) => (
                      <div key={exp.id} className="relative p-4 border border-transparent hover:border-cobalt-100/20 rounded-lg transition-all">
                        {editMode && (
                          <div className="absolute -right-2 -top-2 flex space-x-2 z-10">
                            <button
                              onClick={() => handleRemoveExperience(exp.id)}
                              className="p-1.5 bg-navy-800 rounded-full border border-cobalt-100/40 hover:bg-red-500/20 transition-colors"
                            >
                              <X className="h-3.5 w-3.5 text-red-400" />
                            </button>
                          </div>
                        )}

                        {editMode ? (
                          <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Job Title"
                                className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full"
                                value={exp.title}
                                onChange={(e) => handleEditExperience(exp.id, 'title', e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="Company"
                                className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full"
                                value={exp.company}
                                onChange={(e) => handleEditExperience(exp.id, 'company', e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <input
                                type="text"
                                placeholder="Start Date"
                                className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full"
                                value={exp.startDate}
                                onChange={(e) => handleEditExperience(exp.id, 'startDate', e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="End Date (or Present)"
                                className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full"
                                value={exp.endDate || ''}
                                onChange={(e) => handleEditExperience(exp.id, 'endDate', e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="Location"
                                className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full"
                                value={exp.location}
                                onChange={(e) => handleEditExperience(exp.id, 'location', e.target.value)}
                              />
                            </div>
                            <textarea
                              placeholder="Description"
                              className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full h-24 resize-none"
                              value={exp.description}
                              onChange={(e) => handleEditExperience(exp.id, 'description', e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <div className="h-12 w-12 rounded-lg bg-cream-100 flex items-center justify-center text-lg font-semibold mr-4 flex-shrink-0">
                              {exp.company?.charAt(0) || 'J'}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">{exp.title || 'Untitled Role'}</h3>
                              <p className="text-cobalt-600/70">{exp.company || 'Unknown Company'} • {exp.location || 'Remote'}</p>
                              <p className="text-sm text-cobalt-500 mt-1">
                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                              </p>
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

                {/* Education section */}
                <div className="cs-glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Education</h2>
                    {editMode && (
                      <button
                        onClick={handleAddEducation}
                        className="p-2 bg-cream-100 rounded-lg hover:bg-cream-200 transition-colors"
                      >
                        <Plus className="h-5 w-5 text-cobalt-500" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-6">
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="relative p-4 border border-transparent hover:border-cobalt-100/20 rounded-lg transition-all">
                        {editMode && (
                          <div className="absolute -right-2 -top-2 flex space-x-2 z-10">
                            <button
                              onClick={() => handleRemoveEducation(edu.id)}
                              className="p-1.5 bg-navy-800 rounded-full border border-cobalt-100/40 hover:bg-red-500/20 transition-colors"
                            >
                              <X className="h-3.5 w-3.5 text-red-400" />
                            </button>
                          </div>
                        )}

                        {editMode ? (
                          <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Degree"
                                className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full"
                                value={edu.degree}
                                onChange={(e) => handleEditEducation(edu.id, 'degree', e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="Institution"
                                className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full"
                                value={edu.institution}
                                onChange={(e) => handleEditEducation(edu.id, 'institution', e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Start Date"
                                className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full"
                                value={edu.startDate}
                                onChange={(e) => handleEditEducation(edu.id, 'startDate', e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="End Date"
                                className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-2 text-sm w-full"
                                value={edu.endDate}
                                onChange={(e) => handleEditEducation(edu.id, 'endDate', e.target.value)}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <div className="h-12 w-12 rounded-lg bg-cream-100 flex items-center justify-center mr-4 flex-shrink-0">
                              <GraduationCap className="h-6 w-6 text-cobalt-600/70" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">{edu.degree || 'Degree Unknown'}</h3>
                              <p className="text-cobalt-600/70">{edu.institution || 'Institution Unknown'} • {edu.location}</p>
                              <p className="text-sm text-cobalt-500 mt-1">
                                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                              </p>
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

              {/* Sidebar: Skills */}
              <div className="space-y-8">
                <div className="cs-glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Skills</h2>
                    {editMode && (
                      <div className="flex items-center gap-2">
                        {/* Inline Add Skill */}
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder="Add skill..."
                            className="bg-cream-50 border border-cobalt-100 rounded-md px-3 py-1 text-xs w-24 focus:w-40 transition-all duration-300 outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddSkill((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {profile.skills.map((skill) => (
                      <div key={skill.name} className="relative group">
                        {editMode && (
                          <button
                            onClick={() => handleRemoveSkill(skill.name)}
                            className="absolute -right-2 -top-2 p-1 bg-white rounded-full border border-red-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3 text-red-500" />
                          </button>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium">{skill.name}</h3>
                          {editMode ? (
                            <select
                              className="text-[10px] bg-transparent outline-none border-b border-cobalt-100/50 cursor-pointer"
                              value={skill.level}
                              onChange={(e) => handleEditSkillLevel(skill.name, e.target.value)}
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="expert">Expert</option>
                            </select>
                          ) : (
                            <span className="text-xs text-cobalt-500 capitalize">{skill.level}</span>
                          )}
                        </div>
                        <div className="w-full bg-cream-100 rounded-full h-1.5">
                          <div className={`${getSkillLevelColor(skill.level)} h-1.5 rounded-full ${getSkillLevelWidth(skill.level)} transition-all duration-500`}></div>
                        </div>
                      </div>
                    ))}
                    {profile.skills.length === 0 && (
                      <p className="text-xs text-cobalt-400 italic">No skills added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* --- RESUME TAB (UPLOAD FEATURE) --- */}
          {activeSection === 'resume' && (
            <div className="cs-glass rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">Resume Management</h2>
              {profile.resumeUrl ? (
                <div className="mb-8">
                  <div className="bg-white border border-cobalt-100/40 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="h-12 w-12 rounded-lg bg-cobalt-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <FileText className="h-6 w-6 text-cobalt-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{profile.resumeUrl}</h3>
                        <p className="text-sm text-cobalt-500">Uploaded recently</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-lg transition-colors">View</button>
                      <button onClick={() => document.getElementById('resume-upload')?.click()} className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-lg transition-colors">Replace</button>
                      <button onClick={() => setProfile({ ...profile, resumeUrl: null })} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8 bg-white border border-cobalt-100/40 border-dashed rounded-lg p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cobalt-100 text-cobalt-500 mb-4">
                    <Upload className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Upload Your Resume</h3>
                  <p className="text-cobalt-600/70 mb-6 max-w-md mx-auto">Upload your resume to enable one-click applications.</p>
                  <input type="file" id="resume-upload" className="hidden" accept=".pdf,.docx,.rtf" onChange={handleResumeUpload} />
                  <button onClick={() => document.getElementById('resume-upload')?.click()} className="px-6 py-3 bg-gradient-to-r from-cobalt-600 to-cobalt-800 hover:from-electric-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300">Upload Resume</button>
                </div>
              )}
            </div>
          )}

          {/* --- APPLIED JOBS TAB (PORTED FROM DASHBOARD) --- */}
          {activeSection === 'applied' && (
            <div className="cs-glass rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">Applied Jobs (Applications)</h2>
              <div className="space-y-4">
                {mockAppliedJobs.map(app => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-white border border-cobalt-100/40 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-cobalt-100 flex items-center justify-center text-cobalt-500 mr-4 font-bold">{app.company.charAt(0)}</div>
                      <div>
                        <h3 className="font-medium">{app.position}</h3>
                        <p className="text-sm text-cobalt-500">{app.company} • Applied on {app.appliedDate}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${getStatusColor(app.status)}`}>{app.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SAVED JOBS TAB (PORTED FROM DASHBOARD) --- */}
          {activeSection === 'saved' && (
            <div className="cs-glass rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">Saved Jobs</h2>
              <div className="space-y-4">
                {mockSavedJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-white border border-cobalt-100/40 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-cobalt-100 flex items-center justify-center text-cobalt-500 mr-4 font-bold">{job.company.charAt(0)}</div>
                      <div>
                        <h3 className="font-medium">{job.position}</h3>
                        <p className="text-sm text-cobalt-500">{job.company} • {job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-cobalt-600 bg-cream-50 px-2 py-1 rounded">{job.salary}</span>
                      <button className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"><Heart className="h-5 w-5 fill-current" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SETTINGS TAB (AS IS) --- */}
          {activeSection === 'settings' && (
            <div className="cs-glass rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              <div className="space-y-8">
                <div className="border-b border-cobalt-100/40 pb-8">
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">Email Notifications</h4>
                        <p className="text-sm text-cobalt-500">Receive updates about new job matches and more.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-cobalt-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                {/* Account Actions */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                  <button className="flex items-center text-red-400 hover:text-red-300 transition-colors">
                    <ChevronDown className="h-5 w-5 mr-2" />
                    Delete Account
                  </button>
                </div>
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

