import { Link } from 'react-router-dom';

/**
 * Modern Footer component with gradient background
 *
 * Displays copyright information and social media links
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section-hero animated-bg mt-auto relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500 rounded-full filter blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">Libra-Ai</span>
            </div>
            <p className="text-sm text-muted">
              © {currentYear} Libra-Ai. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-8 mb-6 md:mb-0">
            <Link
              to="/about"
              className="text-sm text-muted hover:text-ink transition-colors font-medium hover:underline"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted hover:text-ink transition-colors font-medium hover:underline"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted hover:text-ink transition-colors font-medium hover:underline"
            >
              Terms
            </Link>
          </div>

          
        </div>
      </div>
    </footer>
  );
}
