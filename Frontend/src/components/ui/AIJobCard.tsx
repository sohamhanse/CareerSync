import { ExternalLink, MapPin, Building, DollarSign, Briefcase, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIJobCardProps {
    job: {
        role: string;
        company: string;
        description: string;
        experience: string;
        location: string;
        salary?: string;
        apply_link: string;
        posted_at?: string;
    };
}

const AIJobCard = ({ job }: AIJobCardProps) => {

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

    return (
        <motion.div
            className="bg-white rounded-xl border border-cobalt-100/50 shadow-card p-5 flex flex-col justify-between h-full cursor-pointer hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -5 }}
        >
            {/* TOP SECTION */}
            <div className="flex items-start gap-4">

                {/* Company Icon */}
                <div className="h-12 w-12 rounded-lg bg-cream-100 flex items-center justify-center border border-cobalt-100/40">
                    <Building className="h-5 w-5 text-cobalt-400" />
                </div>

                {/* Title + Company */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-cobalt-900 line-clamp-1">
                        {job.role}
                    </h3>
                    <p className="text-sm text-cobalt-600">{job.company}</p>
                </div>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-3 mt-4 text-xs text-cobalt-700">

                <span className="flex items-center gap-1 pr-3 border-r border-cobalt-200">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                </span>

                <span className="flex items-center gap-1 pr-3 border-r border-cobalt-200">
                    <Briefcase className="h-4 w-4" />
                    {job.experience}
                </span>

                {job.salary && (
                    <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                    </span>
                )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-cobalt-600/70 mt-4 line-clamp-3">
                {job.description}
            </p>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-5 pt-3 border-t border-cobalt-100/40">

                {/* Time */}
                <span className="text-xs text-cobalt-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(job.posted_at)}
                </span>

                {/* Apply Button */}
                <a
                    href={job.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cs-btn-primary px-4 py-1.5 text-xs rounded-md flex items-center gap-1"
                >
                    Apply <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </motion.div>
    );
};

export default AIJobCard;