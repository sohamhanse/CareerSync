import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Briefcase,
  List,
  Grid,
  Search as SearchIcon,
  X,
  Upload
} from 'lucide-react';

import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import { useSearch } from '@/contexts/SearchContext';

const Search = () => {
  const location = useLocation();

  const {
    searchResults,
    isLoading: isContextLoading,
    error: contextError,
    setSearchParams
  } = useSearch();

  const [filteredJobs, setFilteredJobs] = useState(searchResults?.jobs || []);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Handle Resume Upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  // Sync URL params (ONLY location now)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationParam = params.get('location');

    setSearchParams({
      location: locationParam || '',
    });

    if (searchResults && searchResults.jobs) {
      setFilteredJobs(searchResults.jobs);
    }
  }, [location.search, searchResults]);

  // Sorting logic
  useEffect(() => {
    if (!searchResults) return;

    let result = [...searchResults.jobs];

    if (sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.date_posted).getTime() -
          new Date(a.date_posted).getTime()
      );
    } else if (sortBy === 'match') {
      result.sort((a, b) => {
        if (a.skills_required && b.skills_required) {
          return b.skills_required.length - a.skills_required.length;
        }
        return 0;
      });
    }

    setFilteredJobs(result);
  }, [searchResults, sortBy]);

  // Transform job for UI
  const transformJobForCard = (job: any) => {
    return {
      id: job.job_id,
      title: job.job_title,
      company: job.company_name,
      location: job.location || 'Location not specified',
      company_url: job.company_url,
      salary: job.salary_range
        ? `${job.salary_range.currency} ${job.salary_range.min_amount?.toLocaleString()} - ${job.salary_range.max_amount?.toLocaleString()}`
        : undefined,
      logo_url: job.company_logo,
      description: job.job_description,
      source: job.job_source,
      source_url: job.job_url,
      posted_at: job.date_posted,
      is_remote: job.remote_work === 'Remote',
      experience_level: job.job_level,
      job_type: job.listing_type,
      matchPercentage: job.skills_required
        ? Math.min(job.skills_required.length * 20, 100)
        : undefined,
    };
  };

  const isLoading = isContextLoading;
  const error = contextError;

  return (
    <div className="min-h-screen bg-cream-50 text-cobalt-900">
      <Helmet>
        <title>Job Search | CareerSync</title>
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">

          {/* 🔥 HEADER WITH RESUME + SEARCH */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Find Your Perfect Career Match
            </h1>

            <p className="text-cobalt-600/60 mb-6">
              Upload your resume and get AI-powered job recommendations
            </p>

            <div className="flex flex-col md:flex-row gap-4">

              {/* Resume Upload */}
              <div className="bg-white border border-cobalt-100/50 rounded-xl p-4 flex items-center gap-3 shadow-card w-full md:w-1/3">
                <div className="bg-cobalt-50 p-2 rounded-lg">
                  <Upload className="h-5 w-5 text-cobalt-600" />
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-cobalt-700 cursor-pointer">
                    Upload Resume (PDF)
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>

                  <p className="text-xs text-cobalt-400">
                    {resumeFile ? resumeFile.name : 'No file selected'}
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1">
                <SearchBar />
              </div>

            </div>
          </div>

          {/* RESULTS */}
          <div className="flex-1">

            {/* Header */}
            <div className="bg-white rounded-xl border border-cobalt-100/50 shadow-subtle p-4 mb-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {isLoading
                  ? 'Searching...'
                  : `${filteredJobs.length} jobs found`}
              </h2>

              <div className="flex items-center gap-4">
                <select
                  className="bg-cream-50 rounded-lg px-3 py-2 border border-cobalt-100 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="match">Match Score</option>
                </select>

                <div className="flex border rounded-lg">
                  <button
                    className={`p-2 ${viewMode === 'grid'
                        ? 'bg-cobalt-600 text-white'
                        : ''
                      }`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-5 w-5" />
                  </button>

                  <button
                    className={`p-2 ${viewMode === 'list'
                        ? 'bg-cobalt-600 text-white'
                        : ''
                      }`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Results */}
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredJobs.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredJobs.map((job: any) => (
                  <JobCard
                    key={job.job_id}
                    job={transformJobForCard(job)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <SearchIcon className="mx-auto mb-3" />
                <p>No jobs found</p>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;