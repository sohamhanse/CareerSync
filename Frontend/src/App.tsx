import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import JobDetail from "./pages/JobDetail";
import Applications from "./pages/Applications";
import Onboarding from "./pages/Onboarding";
import JobAggregation from "./pages/features/JobAggregation";
import AIRecommendations from "./pages/features/AIRecommendations";
import ApplicationTracker from "./pages/features/ApplicationTracker";
import RealTimeAlerts from "./pages/features/RealTimeAlerts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ─── Route Guards ────────────────────────────────────────────────────────────

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-navy-900 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-electric-500" /></div>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (user?.profile_complete) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) {
    if (user && !user.profile_complete) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// ─── Page Transition ─────────────────────────────────────────────────────────

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}

// ─── Animated Routes ─────────────────────────────────────────────────────────

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<PublicOnlyRoute><PageTransition><Auth /></PageTransition></PublicOnlyRoute>} />
        <Route path="/search" element={<PageTransition><Search /></PageTransition>} />
        <Route path="/onboarding" element={<OnboardingGuard><PageTransition><Onboarding /></PageTransition></OnboardingGuard>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/job/:id" element={<PageTransition><JobDetail /></PageTransition>} />
        <Route path="/applications" element={<ProtectedRoute><PageTransition><Applications /></PageTransition></ProtectedRoute>} />
        <Route path="/features/job-aggregation" element={<PageTransition><JobAggregation /></PageTransition>} />
        <Route path="/features/ai-recommendations" element={<PageTransition><AIRecommendations /></PageTransition>} />
        <Route path="/features/application-tracker" element={<PageTransition><ApplicationTracker /></PageTransition>} />
        <Route path="/features/real-time-alerts" element={<PageTransition><RealTimeAlerts /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AnimatedRoutes />
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
