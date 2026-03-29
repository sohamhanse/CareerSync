import { ExternalLink, MapPin, Building, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AIJob } from '@/services/api.types';

interface RecommendationCardProps {
  job: AIJob;
  rank: number;
}

const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center gap-2 text-xs">
    <span className="w-20 text-cobalt-500 shrink-0">{label}</span>
    <div className="flex-1 bg-cobalt-100/50 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
    <span className="w-12 text-right font-medium text-cobalt-700">
      {value.toFixed(0)}%
    </span>
  </div>
);

const RecommendationCard = ({ job, rank }: RecommendationCardProps) => {
  return (
    <motion.div
      className="bg-white rounded-xl border border-cobalt-100/50 shadow-subtle p-5 flex flex-col gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-cobalt-50 flex items-center justify-center text-sm font-bold text-cobalt-600 shrink-0">
          #{rank}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-cobalt-900 leading-tight line-clamp-1">
            {job.role}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-cobalt-600">
            <span className="flex items-center gap-1">
              <Building className="h-3.5 w-3.5" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-cobalt-700">
            {job.match_score}%
          </div>
          <div className="text-xs text-cobalt-400">match</div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cobalt-50 text-cobalt-600 text-xs">
          <Briefcase className="h-3 w-3" />
          {job.experience}
        </span>
      </div>

      {/* Score */}
      <div className="space-y-1.5">
        <ScoreBar label="Match" value={job.match_score} color="bg-cobalt-600" />
      </div>

      {/* Skills */}
      <div className="space-y-2">
        {job.matching_skills.length > 0 && (
          <div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 mb-1">
              <CheckCircle className="h-3.5 w-3.5" />
              Matched Skills ({job.matching_skills.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {job.matching_skills.slice(0, 8).map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs">
                  {skill}
                </span>
              ))}
              {job.matching_skills.length > 8 && (
                <span className="px-2 py-0.5 text-xs text-cobalt-400">
                  +{job.matching_skills.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}
        {job.missing_skills.length > 0 && (
          <div>
            <div className="flex items-center gap-1 text-xs font-medium text-amber-600 mb-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Skills to Learn ({job.missing_skills.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {job.missing_skills.slice(0, 5).map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs">
                  {skill}
                </span>
              ))}
              {job.missing_skills.length > 5 && (
                <span className="px-2 py-0.5 text-xs text-cobalt-400">
                  +{job.missing_skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {job.apply_link && job.apply_link !== '#' && (
        <a
          href={job.apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="cs-btn-primary px-4 py-2 text-sm rounded-lg text-center flex items-center justify-center gap-2"
        >
          Apply Now
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </motion.div>
  );
};

export default RecommendationCard;
