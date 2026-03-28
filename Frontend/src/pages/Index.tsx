
import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import StatisticsBar from '../components/StatisticsBar';
import Footer from '../components/Footer';
import FeaturesSection from '../components/landing/FeaturesSection';
import FeaturedJobsSection from '../components/landing/FeaturedJobsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CtaSection from '../components/landing/CtaSection';
import DownloadAppSection from '../components/AppSection';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen bg-cream-50 text-cobalt-900 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <StatisticsBar />
      <FeaturedJobsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
      <DownloadAppSection />
      <Footer />
    </div>
  );
};

export default Index;
