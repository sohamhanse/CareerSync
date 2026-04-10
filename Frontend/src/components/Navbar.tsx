import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import logo from '../assets/CSLogo1.png';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(
    () => sessionStorage.getItem('profile-banner-dismissed') === 'true'
  );

  const location = useLocation();
  const { user, profile, signOut, isAuthenticated } = useAuth();

  const dismissBanner = () => {
    setBannerDismissed(true);
    sessionStorage.setItem('profile-banner-dismissed', 'true');
  };

  const showProfileBanner =
    isAuthenticated && user && !user.profile_complete && !bannerDismissed;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Dashboard removed
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search Jobs', path: '/search' },
    { name: 'Profile', path: '/profile', authRequired: true },
  ];

  const getInitials = () => {
    if (!profile?.full_name) return 'U';

    const nameParts = profile.full_name.split(' ');
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();

    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-nav py-2 border-b border-cobalt-100/40'
          : 'bg-white/70 backdrop-blur-sm py-4'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-cobalt-600 to-cobalt-800 shadow-button">
                <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-cobalt-900">
                Career<span className="text-gradient">Sync</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks
                .filter(link => !link.authRequired || user)
                .map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                      ? 'text-cobalt-600 bg-cobalt-50'
                      : 'text-cobalt-800/60 hover:text-cobalt-700 hover:bg-cobalt-50/60'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/search" className="p-2 rounded-full hover:bg-cobalt-50">
                <Search className="h-5 w-5 text-cobalt-600" />
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full hover:ring-2 hover:ring-cobalt-300/50 transition-all">
                      <Avatar>
                        <AvatarFallback className="bg-cobalt-100 text-cobalt-600 font-semibold">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 bg-white border-cobalt-100">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-cobalt-900">{profile?.full_name}</span>
                        <span className="text-xs text-cobalt-500">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <Link to="/profile">
                      <DropdownMenuItem className="cursor-pointer hover:bg-cobalt-50">
                        <User className="mr-2 h-4 w-4 text-cobalt-500" />
                        Profile
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={signOut}
                      className="cursor-pointer hover:bg-red-50 text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button className="cs-btn-primary px-5 py-2 rounded-lg text-sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-cobalt-700 hover:bg-cobalt-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-cobalt-100/40 mt-2 shadow-card">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks
                .filter(link => !link.authRequired || user)
                .map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-cobalt-800/70 hover:bg-cobalt-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

              {user ? (
                <Button
                  className="w-full mt-2"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              ) : (
                <Link to="/auth">
                  <Button className="w-full mt-4">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Profile Banner */}
      {showProfileBanner && (
        <div className="fixed top-[60px] left-0 right-0 z-40 bg-cobalt-50 px-4 py-2">
          <div className="container mx-auto flex justify-between text-sm">
            <Link to="/onboarding">
              Complete your profile →
            </Link>
            <button onClick={dismissBanner}>
              <X />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;