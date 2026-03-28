import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as api from "@/services/api";
import type { AuthUser, UserProfile } from "@/services/api.types";

const TOKEN_KEY = "auth_token";

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: string | null }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken]     = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  const persistToken = (t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) { setIsLoading(false); return; }
    try {
      const res = await api.getMe();
      if (res.success && res.data.user) {
        const { profile: p, ...u } = res.data.user as any;
        setUser(u);
        setProfile(p || null);
      }
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const signUp = async (email: string, password: string) => {
    try {
      const res = await api.register(email, password);
      persistToken(res.data.token);
      setUser(res.data.user);
      toast.success("Account created!");
      navigate("/onboarding");
      return { error: null };
    } catch (err: any) {
      toast.error(err.message);
      return { error: err.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password);
      persistToken(res.data.token);
      setUser(res.data.user);
      toast.success("Welcome back!");
      navigate(res.data.user.profile_complete ? "/profile" : "/onboarding");
      return { error: null };
    } catch (err: any) {
      toast.error(err.message);
      return { error: err.message };
    }
  };

  const signOut = () => {
    clearSession();
    toast.success("Signed out");
    navigate("/");
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await api.updateProfile(data);
      setProfile(res.data.profile);
      setUser((prev) => prev ? { ...prev, profile_complete: res.data.profile_complete } : prev);
      toast.success("Profile saved!");
      return { error: null };
    } catch (err: any) {
      toast.error(err.message);
      return { error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, profile, token, isLoading,
      isAuthenticated: !!user,
      signUp, signIn, signOut, updateProfile, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
