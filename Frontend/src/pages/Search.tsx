import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Briefcase,
  Upload,
  Loader2,
  Brain,
  FileText,
  X,
  Sparkles,
} from 'lucide-react';

import Navbar from '../components/Navbar';
import AIJobCard from '../components/ui/AIJobCard';
import JobDetailModal from '../components/JobDetailModal';
import Footer from '../components/Footer';
import { analyzeResume } from '@/services/api';
import type { RecommendationResponse, AIJob } from '@/services/api.types';

// Module-level cache so results survive component unmount/remount on tab switch
let cachedResult: RecommendationResponse | null = null;
let cachedLocation: string = '';

const Search = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [location, setLocation] = useState<string>(cachedLocation);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RecommendationResponse | null>(cachedResult);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Job detail modal
  const [selectedJob, setSelectedJob] = useState<AIJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    setResumeFile(file);
    setAnalysisError(null);
  };

  const clearResume = () => {
    setResumeFile(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    cachedResult = null;
    cachedLocation = '';
  };

  const handleAnalyze = async () => {
    if (!resumeFile) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(resumeFile, location);
      if (!result.success || (result.error && result.jobs.length === 0)) {
        setAnalysisError(result.error || 'No results found');
      } else {
        setAnalysisResult(result);
        cachedResult = result;
        cachedLocation = location;
      }
    } catch (err: any) {
      setAnalysisError(err.message || 'Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openJobDetail = (job: AIJob) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream-50 text-cobalt-900">
      <Helmet>
        <title>AI Job Matcher | CareerSync</title>
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">

          {/* HEADER */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-cobalt-50 text-cobalt-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Powered by ConvDeepFM + BERT + Groq LLM
            </div>
            <h1 className="text-4xl font-bold mb-3">
              AI-Powered Job Matcher
            </h1>
            <p className="text-cobalt-600/60 max-w-2xl mx-auto">
              Upload your resume and our AI will parse your skills, scrape live job listings,
              and score each match using our CNN model.
            </p>
          </div>

          {/* RESUME UPLOAD CARD */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="bg-white border border-cobalt-100/50 rounded-2xl p-6 shadow-card">
              <div className="flex flex-col gap-5">
                <div className="flex bg-cobalt-50/50 rounded-xl p-3 border border-cobalt-100 focus-within:ring-2 focus-within:ring-cobalt-500">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-cobalt-500 uppercase tracking-wide">
                      Job Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remote, San Francisco, India"
                      className="w-full bg-transparent border-none outline-none text-sm text-cobalt-900 mt-1 placeholder:text-cobalt-400 focus:ring-0"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={isAnalyzing}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-cobalt-50 p-3 rounded-xl">
                    <Upload className="h-6 w-6 text-cobalt-600" />
                  </div>

                <div className="flex-1 min-w-0">
                  {resumeFile ? (
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-cobalt-500 shrink-0" />
                      <span className="text-sm font-medium text-cobalt-700 truncate">
                        {resumeFile.name}
                      </span>
                      <button onClick={clearResume} className="shrink-0 p-1 hover:bg-cobalt-100 rounded-lg cursor-pointer">
                        <X className="h-4 w-4 text-cobalt-400" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <span className="text-base font-medium text-cobalt-700">
                        Upload your resume
                      </span>
                      <p className="text-sm text-cobalt-400 mt-0.5">
                        PDF or DOCX, max 10MB
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {resumeFile && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="cs-btn-primary px-6 py-2.5 text-sm rounded-xl flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Brain className="h-4 w-4" />
                    )}
                    {isAnalyzing ? 'Analyzing...' : 'Find Matching Jobs'}
                  </button>
                )}
              </div>
              </div>
            </div>
          </div>

          {/* ANALYZING STATE */}
          {isAnalyzing && (
            <div className="text-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-cobalt-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-cobalt-700 mb-2">
                Analyzing Your Resume
              </h3>
              <p className="text-cobalt-500 max-w-md mx-auto">
                Parsing skills, scraping live job listings, and scoring matches with our AI model.
                This may take a minute...
              </p>
            </div>
          )}

          {/* ERROR STATE */}
          {analysisError && !isAnalyzing && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 font-medium">{analysisError}</p>
                <button
                  onClick={handleAnalyze}
                  className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {analysisResult && !isAnalyzing && (
            <>
              {/* Profile Summary */}
              <div className="bg-white rounded-xl border border-cobalt-100/50 shadow-subtle p-5 mb-6">
                <h3 className="font-semibold text-cobalt-800 mb-3">Analysis Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-cobalt-400 block">Domain</span>
                    <span className="font-medium">{analysisResult.candidate_domain}</span>
                  </div>
                  <div>
                    <span className="text-cobalt-400 block">Skills Detected</span>
                    <span className="font-medium">{analysisResult.candidate_skills_count}</span>
                  </div>
                  <div>
                    <span className="text-cobalt-400 block">Jobs Analyzed</span>
                    <span className="font-medium">{analysisResult.total_analyzed}</span>
                  </div>
                  <div>
                    <span className="text-cobalt-400 block">Parse Method</span>
                    <span className="font-medium">{analysisResult.parse_source}</span>
                  </div>
                </div>
              </div>

              {/* Results Header */}
              <div className="bg-white rounded-xl border border-cobalt-100/50 shadow-subtle p-4 mb-6 flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {analysisResult.jobs.length} AI-Matched Jobs
                </h2>
                <span className="text-xs text-cobalt-400">
                  Click a card for full details
                </span>
              </div>

              {/* AI Job Cards */}
              {analysisResult.jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisResult.jobs.map((job, i) => (
                    <div key={`${job.role}-${job.company}-${i}`}>
                      <div className="relative">
                        <div className="absolute -top-2 -right-2 z-10 bg-cobalt-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {job.match_score}% match
                        </div>
                        <AIJobCard job={job} onClick={() => openJobDetail(job)} />
                      </div>
                      {/* Skills section */}
                      <div className="bg-white rounded-b-xl border border-t-0 border-cobalt-100/50 px-5 pb-4 -mt-1">
                        {job.matching_skills.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-emerald-600">Matched: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {job.matching_skills.slice(0, 6).map((skill) => (
                                <span key={skill} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs">
                                  {skill}
                                </span>
                              ))}
                              {job.matching_skills.length > 6 && (
                                <span className="text-xs text-cobalt-400">+{job.matching_skills.length - 6}</span>
                              )}
                            </div>
                          </div>
                        )}
                        {job.missing_skills.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-amber-600">To learn: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {job.missing_skills.slice(0, 4).map((skill) => (
                                <span key={skill} className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs">
                                  {skill}
                                </span>
                              ))}
                              {job.missing_skills.length > 4 && (
                                <span className="text-xs text-cobalt-400">+{job.missing_skills.length - 4}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-cobalt-300 mx-auto mb-3" />
                  <p className="text-cobalt-500">No matching jobs found. Try a different resume.</p>
                </div>
              )}
            </>
          )}

          {/* EMPTY STATE */}
          {!resumeFile && !analysisResult && !isAnalyzing && !analysisError && (
            <div className="text-center py-16">
              <div className="bg-cobalt-50 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Brain className="h-10 w-10 text-cobalt-400" />
              </div>
              <h3 className="text-xl font-semibold text-cobalt-700 mb-2">
                Upload your resume to get started
              </h3>
              <p className="text-cobalt-500 max-w-md mx-auto">
                Our AI will extract your skills, find relevant job listings across multiple platforms,
                and rank them using a deep learning model trained on real job-matching data.
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedJob(null); }}
      />
    </div>
  );
};

export default Search;
