import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DownloadAppSection from './AppSection';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const floatingElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!floatingElementsRef.current) return;

      const elements = floatingElementsRef.current.querySelectorAll('.floating-element');
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const moveX = (clientX - centerX) / 50;
      const moveY = (clientY - centerY) / 50;

      elements.forEach((el, i) => {
        const depth = (i + 1) * 0.5;
        const translateX = moveX * depth;
        const translateY = moveY * depth;
        (el as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-hero-gradient">
      {/* Floating glow orbs */}
      <div
        ref={floatingElementsRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="floating-element absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-cobalt-400/15 blur-3xl"></div>
        <div className="floating-element absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-cream-200/10 blur-3xl"></div>
        <div className="floating-element absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-cobalt-300/10 blur-3xl"></div>
        <div className="floating-element absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-cream-300/8 blur-3xl"></div>
        <div className="floating-element absolute top-1/4 left-1/3 w-40 h-40 rounded-full bg-cobalt-500/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          <h1
            className="mt-10 text-4xl md:text-5xl lg:text-7xl font-medium tracking-wider mb-8 animate-fade-in leading-tight text-white tracking-wide"
            style={{ fontFamily: "'Jaro', sans-serif" }}
          >
            Synchronize Your <span className="text-cream-200">Career Journey</span> Across Platforms
          </h1>

          <p className="text-lg md:text-xl text-cobalt-100/80 mb-10 max-w-3xl animate-fade-in animate-delay-100 leading-relaxed">
            CareerSync aggregates job listings from multiple sources, offering AI-powered recommendations
            and smart application tracking to streamline your job search experience.
          </p>

          {/* <div className="w-full max-w-2xl mx-auto mb-12 animate-fade-in animate-delay-200">
            <SearchBar />
          </div> */}

          <div className="flex flex-wrap justify-center gap-5 animate-fade-in animate-delay-300 mb-12">
            <button
              onClick={() => navigate(isAuthenticated ? '/search' : '/auth')}
              className="bg-cream-200 text-cobalt-900 hover:bg-cream-100 px-8 py-4 rounded-xl shadow-button transition-all duration-300 font-semibold flex items-center hover:-translate-y-0.5"
            >
              Explore Jobs
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button onClick={scrollToFeatures} className="bg-white/10 hover:bg-white/15 text-white border border-white/25 backdrop-blur-md px-8 py-4 rounded-xl transition-all duration-300 font-semibold flex items-center group hover:-translate-y-0.5">
              How It Works
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 group-hover:translate-y-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Scroll indicator */}
          {/* <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToFeatures}>
            <div className="p-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/15 transition-colors">
              <ChevronDown className="h-6 w-6 text-white" />
            </div>
          </div> */}
        </div>
      </div>

      {/* Wave divider — cream colored */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-0">
        <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 74">
          <path
            fill="#faf9f0"
            d="M0,37L48,46.3C96,56,192,74,288,74C384,74,480,56,576,46.3C672,37,768,37,864,42.2C960,46,1056,56,1152,56C1248,56,1344,46,1392,42.2L1440,37L1440,74L1392,74C1344,74,1248,74,1152,74C1056,74,960,74,864,74C768,74,672,74,576,74C480,74,384,74,288,74C192,74,96,74,48,74L0,74Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
