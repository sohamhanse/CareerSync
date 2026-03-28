
import { BarChart2, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/CSLogo1.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#' },
      { name: 'AI Recommendations', href: '#' },
      { name: 'Application Tracking', href: '#' },
      { name: 'Career Insights', href: '#' },
      { name: 'Mobile App', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Partners', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Guides', href: '#' },
      { name: 'API Status', href: '#' },
      { name: 'Community', href: '#' },
    ],
    legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Data Processing', href: '#' },
    ],
  };

  return (
    <footer className="bg-cobalt-900 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              {/* <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-cobalt-600 to-cobalt-800 shadow-button">
                <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
              </div> */}
              <span className="text-xl font-bold tracking-tight text-white">
                Career<span className="text-cream-200">Sync</span>
              </span>
            </Link>
            <p className="text-cobalt-200/70 mb-6 max-w-md leading-relaxed">
              CareerSync aggregates job listings from multiple sources, offering AI-powered
              recommendations and smart application tracking to streamline your job search.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Github, label: 'GitHub' },
                { icon: Instagram, label: 'Instagram' },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#" className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-cobalt-200/60 hover:bg-white/10 hover:text-cream-200 transition-all duration-300" aria-label={label}>
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-cream-200 uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-cobalt-200/60 hover:text-cream-200 transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream-200 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-cobalt-200/60 hover:text-cream-200 transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream-200 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-cobalt-200/60 hover:text-cream-200 transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-semibold text-cream-200 uppercase tracking-wider mt-6 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-cobalt-200/60 hover:text-cream-200 transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cobalt-200/50 text-sm mb-4 md:mb-0">
            &copy; {currentYear} CareerSync. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-cobalt-200/50 hover:text-cream-200 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-cobalt-200/50 hover:text-cream-200 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-cobalt-200/50 hover:text-cream-200 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
