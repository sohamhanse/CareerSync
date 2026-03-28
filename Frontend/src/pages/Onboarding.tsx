import { useState, useCallback, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserProfile } from "@/services/api.types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X, User, Code, Briefcase, Globe, Loader2 } from "lucide-react";
import Navbar from '../components/Navbar';

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TECH_SKILLS = [
  "JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js", "Python", "Java", "Go", "Rust",
  "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "PostgreSQL", "MySQL", "MongoDB",
  "Redis", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "GraphQL", "REST", "gRPC", "Git",
  "CI/CD", "Linux", "Terraform", "Ansible", "Jest", "Cypress", "Webpack", "Vite", "Next.js", "Express",
  "Django", "Flask", "FastAPI", "Spring", "Laravel", "TailwindCSS", "SASS", "HTML", "CSS", "Figma",
  "Pandas", "NumPy", "TensorFlow", "PyTorch", "Spark", "Kafka", "RabbitMQ", "Elasticsearch",
];

const EDUCATION_OPTIONS = ["High School", "Associate", "Bachelor's", "Master's", "PhD", "Bootcamp", "Self-taught", "Other"];
const INDUSTRY_OPTIONS = ["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Media", "Government", "Non-profit", "Consulting", "Real Estate", "Energy", "Transportation", "Telecommunications", "Other"];

const STEP_META = [
  { title: "Tell us about yourself", subtitle: "We'll use this to personalise your experience", icon: User },
  { title: "Your skills & experience", subtitle: "Help us understand your expertise", icon: Code },
  { title: "What are you looking for?", subtitle: "Define your ideal job criteria", icon: Briefcase },
  { title: "Your online presence", subtitle: "Optional â€” helps us find better matches", icon: Globe },
];

// â”€â”€â”€ Tag Input â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TagInput({ tags, setTags, placeholder, suggestions, maxTags, color = "electric" }: {
  tags: string[]; setTags: (t: string[]) => void; placeholder: string;
  suggestions?: string[]; maxTags?: number; color?: "electric" | "purple" | "teal";
}) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const colorMap = { electric: "bg-cobalt-100 text-cobalt-500", purple: "bg-purple-500/20 text-purple-400", teal: "bg-teal-500/20 text-cobalt-600" };

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t || tags.includes(t)) return;
    if (maxTags && tags.length >= maxTags) return;
    setTags([...tags, t]); setInput(""); setShowSuggestions(false);
  };
  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) { e.preventDefault(); addTag(input); }
    if (e.key === "Backspace" && !input && tags.length) removeTag(tags[tags.length - 1]);
  };
  const filtered = suggestions?.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)).slice(0, 6) || [];

  return (
    <div className="relative">
      <div className="bg-cream-50/80 border border-cobalt-100/40 rounded-lg p-3 min-h-[48px] focus-within:ring-2 focus-within:ring-cobalt-500/50 transition-all">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[color]}`}>
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-60"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <input type="text" value={input} onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
          onKeyDown={handleKeyDown} onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length === 0 ? placeholder : "Type & press Enterâ€¦"}
          className="w-full bg-transparent text-cobalt-900 text-sm outline-none placeholder-cobalt-400" />
      </div>
      {showSuggestions && input && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-cream-50 border border-cobalt-100/40 rounded-lg shadow-xl overflow-hidden">
          {filtered.map((s) => (
            <button key={s} type="button" onMouseDown={() => addTag(s)}
              className="w-full px-3 py-2 text-sm text-left text-cobalt-700 hover:bg-cobalt-50 hover:text-cobalt-900 transition-colors">{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Button Group â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ButtonGroup({ options, value, onChange }: { options: { label: string; value: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {options.map((opt) => (
        <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
          className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${value === opt.value ? "border-cobalt-500 text-cobalt-500 bg-cobalt-50" : "border-cobalt-100/40 text-cobalt-500 hover:border-cobalt-500/50 hover:text-cobalt-900 bg-cream-50"
            }`}>{opt.label}</button>
      ))}
    </div>
  );
}

export default function Onboarding() {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [direction, setDirection] = useState(1);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    full_name: "", phone: "", location: "", current_role: "",
    experience_years: 0, skills: [], education: "",
    desired_roles: [], preferred_locations: [], remote_preference: "any",
    job_type: "fulltime", salary_min: 0, salary_max: 0, industry: "",
    github_url: "", linkedin_url: "", portfolio_url: "",
  });

  const updateField = useCallback(<K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const isStepValid = () => step === 0 ? (formData.full_name ?? "").trim().length > 0 : true;

  const goNext = () => { if (step < 3) { setDirection(1); setStep((s) => s + 1); } };
  const goBack = () => { if (step > 0) { setDirection(-1); setStep((s) => s - 1); } };

  const handleSkip = async () => {
    setIsSubmitting(true);
    const finalData = {
      ...formData,
      about: formData.current_role ? `Professional with ${formData.experience_years || 0} years of experience in ${formData.industry || 'the industry'}.` : "",
      experience: formData.current_role ? [{
        id: "1",
        title: formData.current_role,
        company: formData.industry || "Current Company",
        location: formData.location || "",
        startDate: new Date().getFullYear().toString(),
        endDate: "Present",
        description: `Working as a ${formData.current_role}.`
      }] : []
    };
    await updateProfile(finalData);
    setIsSubmitting(false);
    navigate("/dashboard");
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    const finalData = {
      ...formData,
      about: formData.current_role ? `Professional with ${formData.experience_years || 0} years of experience in ${formData.industry || 'the industry'}.` : "",
      experience: formData.current_role ? [{
        id: "1",
        title: formData.current_role,
        company: formData.industry || "Current Company",
        location: formData.location || "",
        startDate: new Date().getFullYear().toString(),
        endDate: "Present",
        description: `Working as a ${formData.current_role}.`
      }] : []
    };
    const { error } = await updateProfile(finalData);
    setIsSubmitting(false);
    if (!error) { setShowSuccess(true); setTimeout(() => navigate("/dashboard"), 1500); }
  };

  if (showSuccess) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <motion.div className="text-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
        <motion.div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
          <Check className="w-10 h-10 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-cobalt-900 mb-2">You're all set!</h2>
        <p className="text-cobalt-500">Redirecting to your dashboardâ€¦</p>
      </motion.div>
    </div>
  );

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  const StepIcon = STEP_META[step].icon;

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar />
      {/* Progress bar */}
      <div className="w-full bg-cream-50 h-1.5">
        <motion.div className="h-full bg-gradient-to-r from-cobalt-500 to-cobalt-700" initial={{ width: "0%" }} animate={{ width: `${((step + 1) / 4) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <motion.div className="text-center mb-8" key={`h-${step}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-center mb-2"><div className="w-10 h-10 rounded-lg bg-cobalt-100 flex items-center justify-center"><StepIcon className="w-5 h-5 text-cobalt-500" /></div></div>
            <p className="text-xs text-cobalt-400 mb-2">Step {step + 1} of 4</p>
            <h1 className="text-2xl font-bold text-cobalt-900 mb-1">{STEP_META[step].title}</h1>
            <p className="text-sm text-cobalt-500">{STEP_META[step].subtitle}</p>
          </motion.div>

          <div className="cs-card rounded-2xl p-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                {step === 0 && (
                  <div className="space-y-5">
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <Input placeholder="John Doe" value={formData.full_name} onChange={(e) => updateField("full_name", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Phone</label>
                      <Input placeholder="+1 (555) 123-4567" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Location</label>
                      <Input placeholder="San Francisco, CA" value={formData.location} onChange={(e) => updateField("location", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Current Role</label>
                      <Input placeholder="e.g. Software Engineer" value={formData.current_role} onChange={(e) => updateField("current_role", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-cobalt-700 mb-1.5">Years of Experience: <span className="text-cobalt-500 font-semibold">{(formData.experience_years ?? 0) === 0 ? "< 1 year" : `${formData.experience_years} years`}</span></label>
                      <input type="range" min="0" max="20" value={formData.experience_years ?? 0} onChange={(e) => updateField("experience_years", Number(e.target.value))} className="w-full h-2 bg-cream-100 rounded-full appearance-none cursor-pointer accent-cobalt-500" />
                      <div className="flex justify-between text-xs text-cobalt-400 mt-1"><span>0</span><span>5</span><span>10</span><span>15</span><span>20</span></div>
                    </div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Skills</label>
                      <TagInput tags={formData.skills || []} setTags={(t) => updateField("skills", t)} placeholder="Type a skill and press Enterâ€¦" suggestions={TECH_SKILLS} /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Education</label>
                      <Select value={formData.education} onValueChange={(v) => updateField("education", v)}>
                        <SelectTrigger className="bg-cream-50 border-cobalt-100"><SelectValue placeholder="Select education level" /></SelectTrigger>
                        <SelectContent>{EDUCATION_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select></div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-5">
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Desired Roles (max 5)</label>
                      <TagInput tags={formData.desired_roles || []} setTags={(t) => updateField("desired_roles", t)} placeholder="e.g. Frontend Developer" maxTags={5} /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Preferred Locations (max 3)</label>
                      <TagInput tags={formData.preferred_locations || []} setTags={(t) => updateField("preferred_locations", t)} placeholder="e.g. San Francisco" maxTags={3} color="purple" />
                      <button type="button" onClick={() => { if (!(formData.preferred_locations || []).includes("Remote")) updateField("preferred_locations", [...(formData.preferred_locations || []), "Remote"]); }}
                        className="mt-2 text-xs text-cobalt-600 hover:text-cobalt-700 px-2 py-1 rounded bg-cobalt-50">+ Add Remote</button></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Remote Preference</label>
                      <ButtonGroup options={[{ label: "Remote", value: "remote" }, { label: "Hybrid", value: "hybrid" }, { label: "On-site", value: "onsite" }, { label: "Any", value: "any" }]} value={formData.remote_preference || "any"} onChange={(v) => updateField("remote_preference", v as UserProfile["remote_preference"])} /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Job Type</label>
                      <ButtonGroup options={[{ label: "Full-time", value: "fulltime" }, { label: "Part-time", value: "parttime" }, { label: "Contract", value: "contract" }, { label: "Internship", value: "internship" }]} value={formData.job_type || "fulltime"} onChange={(v) => updateField("job_type", v as UserProfile["job_type"])} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Min Salary ($)</label>
                        <Input type="number" placeholder="50000" value={formData.salary_min || ""} onChange={(e) => updateField("salary_min", Number(e.target.value))} className="bg-cream-50 border-cobalt-100" /></div>
                      <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Max Salary ($)</label>
                        <Input type="number" placeholder="120000" value={formData.salary_max || ""} onChange={(e) => updateField("salary_max", Number(e.target.value))} className="bg-cream-50 border-cobalt-100" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Industry</label>
                      <Select value={formData.industry} onValueChange={(v) => updateField("industry", v)}>
                        <SelectTrigger className="bg-cream-50 border-cobalt-100"><SelectValue placeholder="Select industry" /></SelectTrigger>
                        <SelectContent>{INDUSTRY_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select></div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-5">
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">GitHub URL</label>
                      <Input placeholder="https://github.com/username" value={formData.github_url} onChange={(e) => updateField("github_url", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">LinkedIn URL</label>
                      <Input placeholder="https://linkedin.com/in/username" value={formData.linkedin_url} onChange={(e) => updateField("linkedin_url", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Portfolio URL</label>
                      <Input placeholder="https://yourportfolio.com" value={formData.portfolio_url} onChange={(e) => updateField("portfolio_url", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-cobalt-100/40">
              <div>{step > 0 && <button type="button" onClick={goBack} className="text-cobalt-500 hover:text-cobalt-900 flex items-center gap-1 text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>}</div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={handleSkip} disabled={isSubmitting} className="text-xs text-cobalt-400 hover:text-cobalt-500 transition-colors">Skip for now</button>
                {step < 3 ? (
                  <button type="button" onClick={goNext} disabled={!isStepValid()} className="cs-btn-primary rounded-lg px-5 py-2 flex items-center gap-1 text-sm disabled:opacity-50">Continue <ArrowRight className="w-4 h-4" /></button>
                ) : (
                  <button type="button" onClick={handleComplete} disabled={isSubmitting} className="cs-btn-primary rounded-lg px-5 py-2 flex items-center gap-1 text-sm">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Complete Setup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

