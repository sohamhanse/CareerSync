import { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import { searchJobs } from '@/services/api';

const SearchBar = () => {
  const {
    setSearchParams,
    setSearchResults,
    setIsLoading,
    setError
  } = useSearch();

  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  // OPTIONAL: Load location from URL (if present)
  useEffect(() => {
    const url = new URL(window.location.href);
    const loc = url.searchParams.get('location');
    if (loc) setLocation(loc);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Only location is optional
    const newSearchParams = {
      location: location || '', // optional
    };

    // Update context
    setSearchParams(newSearchParams);

    // Build URL
    const queryParams = new URLSearchParams();
    if (location) queryParams.append('location', location);

    navigate(`/search?${queryParams.toString()}`);

    setIsLoading(true);
    setError(null);

    try {
      // ✅ Resume is handled internally (backend/model)
      const response = await searchJobs(newSearchParams);

      if (response.success) {
        setSearchResults(response.data);
      } else {
        setError(response.message || 'Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3"
      >
        {/* Location Input Box */}
        <div className="flex items-center flex-1 bg-white rounded-xl shadow-card border border-cobalt-100/50 px-4 py-4 group">
          <MapPin className="h-5 w-5 text-cobalt-300 group-focus-within:text-cobalt-500 transition-colors" />

          <input
            type="text"
            placeholder="Preferred Location (optional)"
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-cobalt-900 px-3 py-1.5 placeholder-cobalt-300 text-base"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {location && (
            <button
              type="button"
              onClick={() => setLocation('')}
              className="text-cobalt-300 hover:text-cobalt-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 🔥 Separate Button */}
        <button
          type="submit"
          className="cs-btn-primary rounded-xl px-6 py-4 flex items-center gap-2 shadow-card"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Get Recommendations</span>
        </button>
      </form>
    </div>
  );
};
export default SearchBar;