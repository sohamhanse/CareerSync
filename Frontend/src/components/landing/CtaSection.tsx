
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, CheckCircle2, Coffee, Star, MapPin } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-24 bg-cta-gradient relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/5 w-32 h-32 rounded-full bg-cobalt-400/10 blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/5 w-48 h-48 rounded-full bg-cream-200/5 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-cobalt-800/50 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium text-white animate-pulse-gentle">
            <Calendar className="inline-block h-4 w-4 mr-2" /> Limited time offer: Get 30% off premium plans
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
            Ready to Supercharge Your <span className="text-cream-200">Job Search</span>?
          </h2>
          <p className="text-cobalt-100/80 text-lg mb-10 leading-relaxed">
            Join thousands of job seekers who have found their dream careers using CareerSync. 
            Our platform helps you find better opportunities faster.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/auth">
              <button className="bg-cream-200 text-cobalt-900 hover:bg-cream-100 px-8 py-4 rounded-xl shadow-button transition-all duration-300 font-semibold text-lg flex items-center hover:-translate-y-1">
                Create Free Account
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </Link>
            <Link to="/search">
              <button className="bg-white/10 hover:bg-white/15 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl transition-all duration-300 font-semibold text-lg hover:-translate-y-1">
                Learn More
              </button>
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-cream-200 mr-2" />
              <span className="text-cobalt-100/80">No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-cream-200 mr-2" />
              <span className="text-cobalt-100/80">Cancel anytime</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-cream-200 mr-2" />
              <span className="text-cobalt-100/80">24/7 support</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-cobalt-200/50 mb-4">Trusted by job seekers worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-cobalt-200/40 flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                <span className="font-medium">TechCrunch</span>
              </div>
              <div className="text-cobalt-200/40 flex items-center gap-2">
                <Star className="h-5 w-5" />
                <span className="font-medium">Forbes</span>
              </div>
              <div className="text-cobalt-200/40 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Business Insider</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
