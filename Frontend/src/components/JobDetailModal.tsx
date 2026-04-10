import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, MapPin, Building, Briefcase, Clock, Award,
  TrendingUp, TrendingDown, Minus, BookmarkPlus, CheckCircle2,
  Globe, Star, ChevronDown, ChevronUp, Bookmark,
} from 'lucide-react';
import type { AIJob } from '@/services/api.types';
import { useAuth } from '@/contexts/AuthContext';
import { toggleSavedJob, submitApplication } from '@/services/api';
import { toast } from 'sonner';

interface JobDetailModalProps {
  job: AIJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  onApplied?: () => void;
}

const getSourceFromUrl = (url: string): { name: string; color: string } => {
  if (url.includes('linkedin')) return { name: 'LinkedIn', color: 'bg-blue-100 text-blue-700' };
  if (url.includes('indeed')) return { name: 'Indeed', color: 'bg-indigo-100 text-indigo-700' };
  if (url.includes('glassdoor')) return { name: 'Glassdoor', color: 'bg-green-100 text-green-700' };
  if (url.includes('google')) return { name: 'Google Jobs', color: 'bg-red-100 text-red-700' };
  if (url.includes('ziprecruiter')) return { name: 'ZipRecruiter', color: 'bg-emerald-100 text-emerald-700' };
  if (url.includes('naukri')) return { name: 'Naukri', color: 'bg-purple-100 text-purple-700' };
  if (url.includes('bayt')) return { name: 'Bayt', color: 'bg-orange-100 text-orange-700' };
  return { name: 'Job Board', color: 'bg-gray-100 text-gray-700' };
};

const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-emerald-600';
  if (score >= 50) return 'text-cobalt-600';
  if (score >= 30) return 'text-amber-600';
  return 'text-red-500';
};

const getScoreBg = (score: number) => {
  if (score >= 70) return 'from-emerald-500 to-emerald-600';
  if (score >= 50) return 'from-cobalt-500 to-cobalt-600';
  if (score >= 30) return 'from-amber-500 to-amber-600';
  return 'from-red-400 to-red-500';
};

const getExperienceMatch = (experience: string): { label: string; color: string; icon: typeof TrendingUp } => {
  const exp = experience.toLowerCase();
  if (exp.includes('not specified') || exp === '') return { label: 'Not specified', color: 'text-cobalt-400', icon: Minus };
  const yearsMatch = exp.match(/(\d+)/);
  const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;
  if (years <= 2) return { label: 'Entry Level - Great for freshers', color: 'text-emerald-600', icon: TrendingUp };
  if (years <= 5) return { label: 'Mid Level', color: 'text-amber-600', icon: Minus };
  return { label: 'Senior Level', color: 'text-red-500', icon: TrendingDown };
};

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return '';
  const now = new Date();
  const posted = new Date(dateString);
  const diff = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
};

export default function JobDetailModal({ job, isOpen, onClose, onSaved, onApplied }: JobDetailModalProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Reset state when a different job is opened
  const jobKey = job ? `${job.role}-${job.company}` : '';
  useEffect(() => {
    setIsSaved(false);
    setIsApplied(false);
    setIsSaving(false);
    setIsApplying(false);
    setShowFullDesc(false);
  }, [jobKey]);

  if (!job) return null;

  const source = getSourceFromUrl(job.apply_link);
  const expMatch = getExperienceMatch(job.experience);
  const ExpIcon = expMatch.icon;

  const handleSave = async () => {
    if (!user) { toast.error('Please sign in to save jobs'); return; }
    setIsSaving(true);
    try {
      const jobId = btoa(`${job.role}-${job.company}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
      await toggleSavedJob(jobId, 'save', job);
      setIsSaved(true);
      toast.success('Job saved!');
      onSaved?.();
    } catch { toast.error('Failed to save job'); }
    setIsSaving(false);
  };

  const handleApply = async () => {
    if (!user) { toast.error('Please sign in to track applications'); return; }
    setIsApplying(true);
    try {
      const jobId = btoa(`${job.role}-${job.company}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
      await submitApplication({ job_id: jobId, job_data: job, notes: '' });
      setIsApplied(true);
      toast.success('Marked as applied!');
      onApplied?.();
      // Open the actual apply link
      window.open(job.apply_link, '_blank');
    } catch { toast.error('Failed to track application'); }
    setIsApplying(false);
  };

  const descriptionText = job.description || 'No description available.';
  const isLongDesc = descriptionText.length > 400;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-cobalt-100/40">
              <button onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-cobalt-50 rounded-lg transition-colors cursor-pointer">
                <X className="h-5 w-5 text-cobalt-400" />
              </button>

              <div className="flex items-start gap-4 pr-10">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-cobalt-50 to-cobalt-100 flex items-center justify-center flex-shrink-0">
                  <Building className="h-7 w-7 text-cobalt-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-cobalt-900 leading-tight">{job.role}</h2>
                  <p className="text-cobalt-600 mt-0.5">{job.company || 'Company not specified'}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs text-cobalt-500">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                    {job.posted_at && (
                      <span className="flex items-center gap-1 text-xs text-cobalt-400">
                        <Clock className="h-3.5 w-3.5" /> {formatTimeAgo(job.posted_at)}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${source.color}`}>
                      <Globe className="h-3 w-3" /> {source.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body - scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Match Score */}
              <div className="bg-cobalt-50/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-cobalt-700 flex items-center gap-1.5">
                    <Star className="h-4 w-4" /> Match Score
                  </h3>
                  <span className={`text-2xl font-bold ${getScoreColor(job.match_score)}`}>
                    {job.match_score}%
                  </span>
                </div>
                <div className="w-full bg-cobalt-100 rounded-full h-2.5">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${getScoreBg(job.match_score)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${job.match_score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-cobalt-400 mt-2">Scored by CNN model + skill overlap + semantic similarity</p>
              </div>

              {/* Experience Match */}
              <div className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg border border-cobalt-100/30">
                <ExpIcon className={`h-5 w-5 ${expMatch.color}`} />
                <div>
                  <span className="text-sm font-medium text-cobalt-700">Experience: </span>
                  <span className="text-sm text-cobalt-600">{job.experience}</span>
                  <p className={`text-xs mt-0.5 ${expMatch.color}`}>{expMatch.label}</p>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-cobalt-700">Skills Analysis</h3>

                {job.matching_skills.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 mb-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Your Matching Skills ({job.matching_skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.matching_skills.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.missing_skills.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-amber-600 flex items-center gap-1 mb-1.5">
                      <TrendingUp className="h-3.5 w-3.5" /> Skills to Learn ({job.missing_skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.missing_skills.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.matching_skills.length === 0 && job.missing_skills.length === 0 && (
                  <p className="text-sm text-cobalt-400 italic">No skill data available for this job.</p>
                )}
              </div>

              {/* Salary */}
              {job.salary && (
                <div className="flex items-center gap-2 p-3 bg-cream-50 rounded-lg border border-cobalt-100/30">
                  <Award className="h-5 w-5 text-cobalt-500" />
                  <div>
                    <span className="text-sm font-medium text-cobalt-700">Salary: </span>
                    <span className="text-sm text-cobalt-600">{job.salary}</span>
                  </div>
                </div>
              )}

              {/* Job Description */}
              <div>
                <h3 className="text-sm font-semibold text-cobalt-700 mb-2 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" /> Job Description
                </h3>
                <div className="bg-cream-50/50 rounded-lg p-4 border border-cobalt-100/30">
                  <p className={`text-sm text-cobalt-600 leading-relaxed whitespace-pre-line ${!showFullDesc && isLongDesc ? 'line-clamp-6' : ''}`}>
                    {descriptionText}
                  </p>
                  {isLongDesc && (
                    <button onClick={() => setShowFullDesc(!showFullDesc)}
                      className="flex items-center gap-1 text-xs text-cobalt-500 hover:text-cobalt-700 mt-2 cursor-pointer">
                      {showFullDesc ? <><ChevronUp className="h-3.5 w-3.5" /> Show less</> : <><ChevronDown className="h-3.5 w-3.5" /> Read more</>}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-cobalt-100/40 p-4 flex items-center justify-between bg-cream-50/50">
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={isSaving || isSaved}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${isSaved
                    ? 'bg-cobalt-100 text-cobalt-600'
                    : 'border border-cobalt-200 text-cobalt-600 hover:bg-cobalt-50'
                    }`}>
                  {isSaved ? <Bookmark className="h-4 w-4 fill-cobalt-500" /> : <BookmarkPlus className="h-4 w-4" />}
                  {isSaved ? 'Saved' : 'Save Job'}
                </button>
                <button onClick={handleApply} disabled={isApplying || isApplied}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${isApplied
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'border border-cobalt-200 text-cobalt-600 hover:bg-cobalt-50'
                    }`}>
                  {isApplied ? <CheckCircle2 className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                  {isApplied ? 'Applied' : 'Mark Applied'}
                </button>
              </div>
              <a href={job.apply_link} target="_blank" rel="noopener noreferrer"
                className="cs-btn-primary px-5 py-2 text-sm rounded-lg flex items-center gap-1.5 cursor-pointer">
                Apply Now <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
