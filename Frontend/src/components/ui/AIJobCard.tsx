import { useState } from 'react';
import { ExternalLink, MapPin, Building, Briefcase, Clock, Globe, Bookmark, BookmarkPlus, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toggleSavedJob, submitApplication } from '@/services/api';
import { toast } from 'sonner';
import type { AIJob } from '@/services/api.types';

interface AIJobCardProps {
    job: AIJob;
    onClick?: () => void;
}

const getSourceFromUrl = (url: string): { name: string; color: string } => {
    if (url.includes('linkedin')) return { name: 'LinkedIn', color: 'bg-blue-100 text-blue-700' };
    if (url.includes('indeed')) return { name: 'Indeed', color: 'bg-indigo-100 text-indigo-700' };
    if (url.includes('glassdoor')) return { name: 'Glassdoor', color: 'bg-green-100 text-green-700' };
    if (url.includes('google')) return { name: 'Google', color: 'bg-red-100 text-red-700' };
    if (url.includes('ziprecruiter')) return { name: 'ZipRecruiter', color: 'bg-emerald-100 text-emerald-700' };
    if (url.includes('naukri')) return { name: 'Naukri', color: 'bg-purple-100 text-purple-700' };
    if (url.includes('bayt')) return { name: 'Bayt', color: 'bg-orange-100 text-orange-700' };
    return { name: 'Job Board', color: 'bg-gray-100 text-gray-700' };
};

const AIJobCard = ({ job, onClick }: AIJobCardProps) => {
    const { user } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    const formatTimeAgo = (dateString?: string) => {
        if (!dateString) return '';
        const now = new Date();
        const postedDate = new Date(dateString);
        const diff = Math.floor((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return `${diff} days ago`;
        return `${Math.floor(diff / 7)} weeks ago`;
    };

    const source = getSourceFromUrl(job.apply_link);

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { toast.error('Sign in to save jobs'); return; }
        try {
            const jobId = btoa(`${job.role}-${job.company}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
            if (isSaved) {
                await toggleSavedJob(jobId, 'unsave');
                setIsSaved(false);
                toast.success('Removed from saved');
            } else {
                await toggleSavedJob(jobId, 'save', job);
                setIsSaved(true);
                toast.success('Job saved!');
            }
        } catch { toast.error('Failed to save job'); }
    };

    const handleApply = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { toast.error('Sign in to track applications'); return; }
        if (isApplied) return;
        try {
            const jobId = btoa(`${job.role}-${job.company}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
            await submitApplication({ job_id: jobId, job_data: job, notes: '' });
            setIsApplied(true);
            toast.success('Marked as applied!');
            window.open(job.apply_link, '_blank');
        } catch { toast.error('Failed to track application'); }
    };

    return (
        <motion.div
            onClick={onClick}
            className="bg-white rounded-xl border border-cobalt-100/50 shadow-card p-5 flex flex-col justify-between h-full cursor-pointer hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -4 }}
        >
            {/* TOP SECTION */}
            <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-cream-100 flex items-center justify-center border border-cobalt-100/40 flex-shrink-0">
                    <Building className="h-5 w-5 text-cobalt-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-cobalt-900 line-clamp-1">{job.role}</h3>
                    <p className="text-sm text-cobalt-600">{job.company}</p>
                </div>
                {/* Save button */}
                <button onClick={handleSave} className="p-1.5 hover:bg-cobalt-50 rounded-lg transition-colors cursor-pointer flex-shrink-0" title={isSaved ? 'Unsave' : 'Save job'}>
                    {isSaved
                        ? <Bookmark className="h-5 w-5 fill-cobalt-500 text-cobalt-500" />
                        : <BookmarkPlus className="h-5 w-5 text-cobalt-300 hover:text-cobalt-500" />
                    }
                </button>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs text-cobalt-700">
                <span className="flex items-center gap-1 pr-2.5 border-r border-cobalt-200">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                </span>
                <span className="flex items-center gap-1 pr-2.5 border-r border-cobalt-200">
                    <Briefcase className="h-3.5 w-3.5" /> {job.experience}
                </span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${source.color}`}>
                    <Globe className="h-3 w-3" /> {source.name}
                </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-cobalt-600/70 mt-3 line-clamp-2">{job.description}</p>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-cobalt-100/40">
                <span className="text-xs text-cobalt-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatTimeAgo(job.posted_at)}
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={handleApply}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${isApplied
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'cs-btn-primary'
                            }`}>
                        {isApplied
                            ? <><CheckCircle2 className="h-3 w-3" /> Applied</>
                            : <><ExternalLink className="h-3 w-3" /> Apply</>
                        }
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default AIJobCard;
