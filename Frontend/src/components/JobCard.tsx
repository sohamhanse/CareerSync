import { useState, useEffect } from 'react';
import { Bookmark, ExternalLink, MapPin, Building, DollarSign, Briefcase, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { checkJobSaved, toggleSavedJob } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    company_url?: string;
    salary?: string;
    salary_range?: string;
    logo_url?: string;
    description?: string;
    source?: string;
    source_url?: string;
    posted_at: string;
    is_remote?: boolean;
    experience_level?: string;
    job_type?: string;
    matchPercentage?: number;
  };
}

const JobCard = ({ job }: JobCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkJobSaved(job.id).then(setIsSaved).catch(() => { });
    }
  }, [job.id, user]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save jobs",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const action = isSaved ? 'unsave' : 'save';
      await toggleSavedJob(job.id, action);
      setIsSaved(!isSaved);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diff = Math.floor((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return `${Math.floor(diff / 7)} weeks ago`;
  };

  const handleCardClick = () => {
    navigate(`/job/${job.id}`);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.company_url) window.open(job.company_url, '_blank');
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="cs-card-interactive p-5 cursor-pointer flex flex-col justify-between h-full"
      whileHover={{ y: -4 }}
    >
      {/* TOP SECTION */}
      <div className="flex gap-4">
        {/* Logo */}
        <div className="h-12 w-12 rounded-lg bg-cream-100 flex items-center justify-center border border-cobalt-100/40">
          {job.logo_url ? (
            <img src={job.logo_url} className="h-full w-full object-contain p-1" />
          ) : (
            <Building className="h-5 w-5 text-cobalt-400" />
          )}
        </div>

        {/* Title + Company */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-cobalt-900 line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-cobalt-600">{job.company}</p>
        </div>

        {/* Save */}
        <button onClick={handleSave}>
          <Bookmark
            className={`h-5 w-5 ${isSaved ? 'fill-cobalt-500 text-cobalt-500' : 'text-cobalt-300'}`}
          />
        </button>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="flex items-center gap-1 pr-3 border-r border-cobalt-300 text-cobalt-700 text-xs">
          <MapPin className="h-6 w-6 stroke-4" />
          {job.is_remote ? 'Remote' : job.location}
        </span>

        {(job.salary || job.salary_range) && (
          <span className="flex items-center gap-1 pr-3 border-r border-cobalt-300 text-cobalt-700 text-xs">
            <DollarSign className="h-6 w-6 stroke-4" />
            {job.salary || job.salary_range}
          </span>
        )}

        {job.experience_level && (
          <span className="flex items-center gap-1 pr-3 text-cobalt-700 text-xs">
            {job.experience_level === 'senior' ? (
              <Award className="h-6 w-6 stroke-4" />
            ) : (
              <Briefcase className="h-6 w-6 stroke-4" />
            )}
            {job.experience_level}
          </span>
        )}

        {job.job_type && (
          <span className="tag">
            <Briefcase className="icon" />
            {job.job_type}
          </span>
        )}
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm text-cobalt-600/70 mt-4 line-clamp-2">
        {job.description}
      </p>


      {/* FOOTER */}
      <div className="flex justify-between items-center mt-5 pt-3 border-t border-cobalt-100/40">
        <span className="text-xs text-cobalt-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatTimeAgo(job.posted_at)}
        </span>

        <div className="flex gap-2">
          {job.source_url && (
            <button
              onClick={handleApplyClick}
              className="cs-btn-primary px-3 py-1 text-xs rounded-md"
            >
              Apply
            </button>
          )}

          <span className="text-xs text-cobalt-600 flex items-center gap-1">
            Details <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;