import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-8xl font-bold text-cobalt-200 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-cobalt-900 mb-2">Page not found</h2>
          <p className="text-cobalt-600/60 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <button className="cs-btn-primary px-6 py-3 rounded-xl font-medium">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
