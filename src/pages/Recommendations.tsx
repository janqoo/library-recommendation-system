import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getRecommendations } from '@/services/api';
import { Recommendation } from '@/types';
import { handleApiError } from '@/utils/errorHandling';

/**
 * Recommendations page component with AI-powered suggestions
 */
export function Recommendations() {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const exampleQueries = [
    'I love mystery novels with strong female protagonists',
    'Looking for science fiction books about space exploration',
    'Recommend me some feel-good romance novels',
    'I want to read about personal development and productivity',
  ];

  const handleGetRecommendations = async () => {
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    setIsLoading(true);
    try {
      const recs = await getRecommendations(query);
      setRecommendations(recs);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="gradient-text">AI-Powered Recommendations</span>
          </h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Tell us what you're looking for, and our AI will suggest the perfect books for you
          </p>
        </div>

        <div className="glass-effect rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What kind of book are you looking for?
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your ideal book... (e.g., 'I want a thrilling mystery set in Victorian London')"
            className="input-modern min-h-[140px] resize-none"
          />

          <div className="mt-6">
            <p className="text-sm text-slate-700 font-semibold mb-3">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-sm bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-slate-800 px-4 py-2 rounded-xl transition-all border border-violet-200 hover:border-violet-300 font-medium hover:shadow-md"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetRecommendations}
              disabled={isLoading}
              className="w-full"
            >
              <svg
                className="w-5 h-5 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!isLoading && recommendations.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">
              <span className="gradient-text">AI Recommendations for You</span>
            </h2>

            {/* Display AI recommendations */}
            <div className="space-y-6 mb-12">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="glass-effect rounded-2xl shadow-xl border border-white/20 p-6 hover-glow transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    {/* Book Cover */}
                    <div className="w-28 h-40 flex-shrink-0 relative">
                      <img
                        src={`https://covers.openlibrary.org/b/title/${encodeURIComponent((rec.aiBook?.title || 'Unknown').replace(/[^\w\s]/g, '').trim())}-L.jpg`}
                        alt={rec.aiBook?.title || 'Book cover'}
                        className="w-full h-full object-cover rounded-xl shadow-lg"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (!img.dataset.retried) {
                            // First retry: try with medium size
                            img.dataset.retried = 'true';
                            const cleanTitle = (rec.aiBook?.title || '').replace(/[^\w\s]/g, '').trim();
                            img.src = `https://covers.openlibrary.org/b/title/${encodeURIComponent(cleanTitle)}-M.jpg`;
                          } else if (!img.dataset.retriedTwice) {
                            // Second retry: try with author included
                            img.dataset.retriedTwice = 'true';
                            const titleAuthor = `${rec.aiBook?.title || ''} ${rec.aiBook?.author || ''}`.replace(/[^\w\s]/g, '').trim();
                            img.src = `https://covers.openlibrary.org/b/title/${encodeURIComponent(titleAuthor)}-M.jpg`;
                          } else {
                            // Final fallback: show gradient placeholder
                            img.style.display = 'none';
                            const fallback = img.parentElement?.querySelector('.fallback-cover') as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }
                        }}
                      />
                      {/* Fallback gradient cover */}
                      <div 
                        className="fallback-cover absolute inset-0 w-full h-full bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ display: 'none' }}
                      >
                        <svg
                          className="w-12 h-12 text-violet-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Book Info */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {rec.aiBook?.title || 'AI Recommended Book'}
                      </h3>
                      <p className="text-slate-600 mb-3 font-medium">
                        by {rec.aiBook?.author || 'Various Authors'}
                      </p>
                      <p className="text-slate-700 mb-4 leading-relaxed">{rec.reason}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-gradient-to-r from-violet-100 to-indigo-100 px-3 py-1.5 rounded-xl border border-violet-200">
                          <span className="text-sm text-violet-700 font-semibold">
                            AI Confidence: {Math.round(rec.confidence * 100)}%
                          </span>
                        </div>
                        <span className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-3 py-1.5 rounded-xl text-sm font-semibold border border-emerald-200">
                          🤖 AI Powered
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && recommendations.length === 0 && query && (
          <div className="text-center py-12">
            <p className="text-slate-700 text-lg">
              No recommendations yet. Try describing what you're looking for!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
