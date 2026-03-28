
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: 'blue' | 'purple' | 'mixed' | 'default';
  delay?: number;
  link?: string;
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  gradient = 'default',
  delay = 0,
  link = '#'
}: FeatureCardProps) => {
  const getIconClass = () => {
    switch (gradient) {
      case 'blue':
        return 'bg-cobalt-500 shadow-button';
      case 'purple':
        return 'bg-cobalt-700 shadow-button';
      case 'mixed':
        return 'bg-cobalt-gradient shadow-button';
      default:
        return 'bg-cobalt-100';
    }
  };

  return (
    <div 
      className="group bg-white rounded-xl border border-cobalt-100/50 p-8 transition-all duration-300 hover:shadow-hover hover:-translate-y-2 h-full flex flex-col animate-fade-in relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle background accent */}
      <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-cobalt-50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className={`${getIconClass()} rounded-xl p-4 w-14 h-14 flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-4 text-cobalt-900">{title}</h3>
      
      <p className="text-cobalt-700/60 mb-6 leading-relaxed flex-grow">{description}</p>
      
      <div className="mt-auto pt-4">
        <Link 
          to={link} 
          className="text-cobalt-600 font-medium flex items-center group-hover:text-cobalt-800 transition-colors"
        >
          Learn more
          <ChevronRight 
            className="h-5 w-5 ml-1 transform transition-transform group-hover:translate-x-1" 
          />
        </Link>
      </div>
    </div>
  );
};

export default FeatureCard;
