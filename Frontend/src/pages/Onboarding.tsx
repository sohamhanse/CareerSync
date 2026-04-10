import { useState, useCallback, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserProfile } from "@/services/api.types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X, User, Code, Briefcase, Globe, Loader2, FolderGit2, Award } from "lucide-react";
import Navbar from '../components/Navbar';

// --- Constants ---------------------------------------------------------------

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

const EXPERIENCE_LEVELS = [
  { label: "Fresher", value: "fresher", desc: "0 years, student or recent graduate" },
  { label: "Junior", value: "junior", desc: "1-2 years of experience" },
  { label: "Mid-Level", value: "mid", desc: "3-5 years of experience" },
  { label: "Senior", value: "senior", desc: "6+ years of experience" },
];

const STEP_META = [
  { title: "Tell us about yourself", subtitle: "We'll use this to personalise your experience", icon: User },
  { title: "Your skills & experience", subtitle: "Help us understand your expertise", icon: Code },
  { title: "Projects & Certifications", subtitle: "Showcase your work and achievements", icon: FolderGit2 },
  { title: "What are you looking for?", subtitle: "Define your ideal job criteria", icon: Briefcase },
  { title: "Your online presence", subtitle: "Optional - helps us find better matches", icon: Globe },
];

// --- Tag Input ---------------------------------------------------------------

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
          placeholder={tags.length === 0 ? placeholder : "Type & press Enter..."}
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

// --- Button Group ------------------------------------------------------------

function ButtonGroup({ options, value, onChange }: { options: { label: string; value: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {options.map((opt) => (
        <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
          className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${value === opt.value ? "border-cobalt-500 text-cobalt-500 bg-cobalt-50" : "border-cobalt-100/40 text-cobalt-500 hover:border-cobalt-500/50 hover:text-cobalt-900 bg-cream-50"
            }`}>{opt.label}</button>
      ))}
    </div>
  );
}

// --- Project Card (for freshers) ---------------------------------------------

interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  tech_stack: string;
  link: string;
}

function ProjectCard({ project, onChange, onRemove }: {
  project: ProjectEntry;
  onChange: (field: keyof ProjectEntry, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="relative bg-cream-50/60 border border-cobalt-100/40 rounded-lg p-4 space-y-3">
      <button type="button" onClick={onRemove}
        className="absolute -top-2 -right-2 p-1 bg-white rounded-full border border-red-100 hover:bg-red-50 transition-colors cursor-pointer">
        <X className="w-3.5 h-3.5 text-red-400" />
      </button>
      <Input placeholder="Project name" value={project.name}
        onChange={(e) => onChange("name", e.target.value)} className="bg-white border-cobalt-100" />
      <textarea placeholder="Brief description of what it does..."
        value={project.description} onChange={(e) => onChange("description", e.target.value)}
        className="w-full bg-white border border-cobalt-100 rounded-md px-3 py-2 text-sm resize-none h-16 outline-none focus:ring-2 focus:ring-cobalt-500/50" />
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Tech stack (e.g. React, Node)" value={project.tech_stack}
          onChange={(e) => onChange("tech_stack", e.target.value)} className="bg-white border-cobalt-100" />
        <Input placeholder="GitHub/Live link (optional)" value={project.link}
          onChange={(e) => onChange("link", e.target.value)} className="bg-white border-cobalt-100" />
      </div>
    </div>
  );
}

// --- Main Component ----------------------------------------------------------

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

  const [experienceLevel, setExperienceLevel] = useState("fresher");
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);

  const updateField = useCallback(<K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const isFresher = experienceLevel === "fresher";

  const addProject = () => {
    setProjects((prev) => [...prev, { id: Date.now().toString(), name: "", description: "", tech_stack: "", link: "" }]);
  };

  const updateProject = (id: string, field: keyof ProjectEntry, value: string) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const isStepValid = () => step === 0 ? (formData.full_name ?? "").trim().length > 0 : true;

  const totalSteps = STEP_META.length;
  const goNext = () => { if (step < totalSteps - 1) { setDirection(1); setStep((s) => s + 1); } };
  const goBack = () => { if (step > 0) { setDirection(-1); setStep((s) => s - 1); } };

  const buildFinalData = () => {
    const expYears = experienceLevel === "fresher" ? 0
      : experienceLevel === "junior" ? 1
        : experienceLevel === "mid" ? 3
          : (formData.experience_years || 6);

    return {
      ...formData,
      experience_years: formData.experience_years ?? expYears,
      about: formData.current_role
        ? `${experienceLevel === "fresher" ? "Fresher" : "Professional"} with ${expYears} years of experience in ${formData.industry || "the industry"}.`
        : "",
      experience: formData.current_role && !isFresher ? [{
        id: "1",
        title: formData.current_role,
        company: formData.industry || "Current Company",
        location: formData.location || "",
        startDate: new Date().getFullYear().toString(),
        endDate: "Present",
        description: `Working as a ${formData.current_role}.`
      }] : [],
      projects: projects.filter((p) => p.name.trim()),
      certifications,
    };
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    await updateProfile(buildFinalData());
    setIsSubmitting(false);
    navigate("/profile");
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    const { error } = await updateProfile(buildFinalData());
    setIsSubmitting(false);
    if (!error) { setShowSuccess(true); setTimeout(() => navigate("/profile"), 1500); }
  };

  if (showSuccess) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <motion.div className="text-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
        <motion.div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
          <Check className="w-10 h-10 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-cobalt-900 mb-2">You're all set!</h2>
        <p className="text-cobalt-500">Redirecting to your profile...</p>
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
        <motion.div className="h-full bg-gradient-to-r from-cobalt-500 to-cobalt-700" initial={{ width: "0%" }} animate={{ width: `${((step + 1) / totalSteps) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <motion.div className="text-center mb-8" key={`h-${step}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-center mb-2"><div className="w-10 h-10 rounded-lg bg-cobalt-100 flex items-center justify-center"><StepIcon className="w-5 h-5 text-cobalt-500" /></div></div>
            <p className="text-xs text-cobalt-400 mb-2">Step {step + 1} of {totalSteps}</p>
            <h1 className="text-2xl font-bold text-cobalt-900 mb-1">{STEP_META[step].title}</h1>
            <p className="text-sm text-cobalt-500">{STEP_META[step].subtitle}</p>
          </motion.div>

          <div className="cs-card rounded-2xl p-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>

                {/* ── STEP 0: Personal Info ── */}
                {step === 0 && (
                  <div className="space-y-5">
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <Input placeholder="John Doe" value={formData.full_name} onChange={(e) => updateField("full_name", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Phone</label>
                      <Input placeholder="+1 (555) 123-4567" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Location</label>
                      <Input placeholder="San Francisco, CA" value={formData.location} onChange={(e) => updateField("location", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Current Role {isFresher && <span className="text-cobalt-400 font-normal">(or desired role)</span>}</label>
                      <Input placeholder={isFresher ? "e.g. Aspiring Frontend Developer" : "e.g. Software Engineer"} value={formData.current_role} onChange={(e) => updateField("current_role", e.target.value)} className="bg-cream-50 border-cobalt-100" /></div>
                  </div>
                )}

                {/* ── STEP 1: Skills & Experience ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    {/* Experience Level Selector */}
                    <div>
                      <label className="block text-sm font-medium text-cobalt-700 mb-2">Experience Level</label>
                      <div className="grid grid-cols-2 gap-2">
                        {EXPERIENCE_LEVELS.map((lvl) => (
                          <button key={lvl.value} type="button" onClick={() => {
                            setExperienceLevel(lvl.value);
                            const years = lvl.value === "fresher" ? 0 : lvl.value === "junior" ? 1 : lvl.value === "mid" ? 3 : 6;
                            updateField("experience_years", years);
                          }}
                            className={`relative p-3 rounded-lg border text-left transition-all cursor-pointer ${experienceLevel === lvl.value
                              ? "border-cobalt-500 bg-cobalt-50 ring-1 ring-cobalt-500/30"
                              : "border-cobalt-100/40 bg-cream-50 hover:border-cobalt-300"
                              }`}>
                            <span className={`text-sm font-semibold ${experienceLevel === lvl.value ? "text-cobalt-600" : "text-cobalt-700"}`}>{lvl.label}</span>
                            <p className="text-xs text-cobalt-400 mt-0.5">{lvl.desc}</p>
                            {experienceLevel === lvl.value && (
                              <div className="absolute top-2 right-2">
                                <Check className="w-4 h-4 text-cobalt-500" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fine-tune years (if not fresher) */}
                    {!isFresher && (
                      <div>
                        <label className="block text-sm font-medium text-cobalt-700 mb-1.5">
                          Years of Experience: <span className="text-cobalt-500 font-semibold">{formData.experience_years} years</span>
                        </label>
                        <input type="range" min="0" max="20" value={formData.experience_years ?? 0}
                          onChange={(e) => updateField("experience_years", Number(e.target.value))}
                          className="w-full h-2 bg-cream-100 rounded-full appearance-none cursor-pointer accent-cobalt-500" />
                        <div className="flex justify-between text-xs text-cobalt-400 mt-1"><span>0</span><span>5</span><span>10</span><span>15</span><span>20</span></div>
                      </div>
                    )}

                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Skills</label>
                      <TagInput tags={formData.skills || []} setTags={(t) => updateField("skills", t)} placeholder="Type a skill and press Enter..." suggestions={TECH_SKILLS} /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Education</label>
                      <Select value={formData.education} onValueChange={(v) => updateField("education", v)}>
                        <SelectTrigger className="bg-cream-50 border-cobalt-100"><SelectValue placeholder="Select education level" /></SelectTrigger>
                        <SelectContent>{EDUCATION_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select></div>
                  </div>
                )}

                {/* ── STEP 2: Projects & Certifications ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    {/* Projects */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-cobalt-700">
                          Projects {isFresher && <span className="text-cobalt-400 font-normal">(highly recommended for freshers)</span>}
                        </label>
                        <button type="button" onClick={addProject}
                          className="text-xs text-cobalt-500 hover:text-cobalt-700 flex items-center gap-1 px-2 py-1 rounded bg-cobalt-50 cursor-pointer">
                          <FolderGit2 className="w-3 h-3" /> Add Project
                        </button>
                      </div>
                      {projects.length === 0 ? (
                        <button type="button" onClick={addProject}
                          className="w-full border-2 border-dashed border-cobalt-100/60 rounded-lg p-6 text-center hover:border-cobalt-300 transition-colors cursor-pointer group">
                          <FolderGit2 className="w-8 h-8 text-cobalt-300 mx-auto mb-2 group-hover:text-cobalt-400 transition-colors" />
                          <p className="text-sm text-cobalt-400 group-hover:text-cobalt-500">Add your first project</p>
                          <p className="text-xs text-cobalt-300 mt-1">Showcase personal, academic, or open-source work</p>
                        </button>
                      ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {projects.map((p) => (
                            <ProjectCard key={p.id} project={p}
                              onChange={(field, value) => updateProject(p.id, field, value)}
                              onRemove={() => removeProject(p.id)} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Certifications */}
                    <div>
                      <label className="block text-sm font-medium text-cobalt-700 mb-1.5">
                        <Award className="w-4 h-4 inline mr-1 -mt-0.5" />
                        Certifications
                      </label>
                      <TagInput tags={certifications} setTags={setCertifications}
                        placeholder="e.g. AWS Certified, Google Cloud Associate..." color="teal" />
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Job Preferences ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Desired Roles (max 5)</label>
                      <TagInput tags={formData.desired_roles || []} setTags={(t) => updateField("desired_roles", t)} placeholder="e.g. Frontend Developer" maxTags={5} /></div>
                    <div><label className="block text-sm font-medium text-cobalt-700 mb-1.5">Preferred Locations (max 3)</label>
                      <TagInput tags={formData.preferred_locations || []} setTags={(t) => updateField("preferred_locations", t)} placeholder="e.g. San Francisco" maxTags={3} color="purple" />
                      <button type="button" onClick={() => { if (!(formData.preferred_locations || []).includes("Remote")) updateField("preferred_locations", [...(formData.preferred_locations || []), "Remote"]); }}
                        className="mt-2 text-xs text-cobalt-600 hover:text-cobalt-700 px-2 py-1 rounded bg-cobalt-50 cursor-pointer">+ Add Remote</button></div>
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

                {/* ── STEP 4: Online Presence ── */}
                {step === 4 && (
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
              <div>{step > 0 && <button type="button" onClick={goBack} className="text-cobalt-500 hover:text-cobalt-900 flex items-center gap-1 text-sm cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>}</div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={handleSkip} disabled={isSubmitting} className="text-xs text-cobalt-400 hover:text-cobalt-500 transition-colors cursor-pointer">Skip for now</button>
                {step < totalSteps - 1 ? (
                  <button type="button" onClick={goNext} disabled={!isStepValid()} className="cs-btn-primary rounded-lg px-5 py-2 flex items-center gap-1 text-sm disabled:opacity-50 cursor-pointer">Continue <ArrowRight className="w-4 h-4" /></button>
                ) : (
                  <button type="button" onClick={handleComplete} disabled={isSubmitting} className="cs-btn-primary rounded-lg px-5 py-2 flex items-center gap-1 text-sm cursor-pointer">
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
