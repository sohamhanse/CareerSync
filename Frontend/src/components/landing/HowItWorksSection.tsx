
import { Link } from 'react-router-dom';
import { Zap, Activity, CheckCircle2 } from 'lucide-react';
import UltimateFlow from './crazyProcedureSec';

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-cream-100/60 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-cobalt-200/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-cream-300/30 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cobalt-400/50"></div>
            <h2 className="mx-4 text-sm uppercase tracking-wider text-cobalt-500 font-semibold">Process</h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cobalt-400/50"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-cobalt-900">
            How <span className="text-gradient">CareerSync</span> Works
          </h2>
          <p className="text-cobalt-700/60 text-lg leading-relaxed">
            Our platform simplifies your job search with powerful automation and intelligent features.
          </p>
        </div>
        <UltimateFlow />
        <div className="text-center">
          <Link to="/auth">
            <button className="cs-btn-primary px-8 py-4 rounded-xl text-lg font-medium transform hover:-translate-y-1 transition-all duration-300">
              Get Started Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
