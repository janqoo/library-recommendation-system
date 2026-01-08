import React from 'react';

/**
 * BookSearch component props
 * - Controlled inputs so the Books page can keep all filters in sync.
 */
interface BookSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmitSearch: () => void;

  genres: string[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;

  sortBy: string;
  onSortChange: (value: string) => void;

  minRating: string;
  onMinRatingChange: (value: string) => void;

  year: string;
  years: number[];
  onYearChange: (value: string) => void;
}

/**
 * Library-style BookSearch + Filters
 * - Soft paper background
 * - Pill inputs like the reference UI
 */
export function BookSearch({
  query,
  onQueryChange,
  onSubmitSearch,
  genres,
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
  minRating,
  onMinRatingChange,
  year,
  years,
  onYearChange,
}: BookSearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSearch();
  };

  return (
    <div className="card-modern p-4 md:p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by title, author, or genre…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="input-modern pl-11 rounded-full bg-white/70"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <button
            type="submit"
            className="btn-modern rounded-full bg-wood-400 text-ink hover:bg-wood-500 border border-line/70"
          >
            Search
          </button>
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => onGenreChange(e.target.value)}
              className="input-modern rounded-full bg-white/65 py-2.5"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Rating</label>
            <select
              value={minRating}
              onChange={(e) => onMinRatingChange(e.target.value)}
              className="input-modern rounded-full bg-white/65 py-2.5"
            >
              <option value="">All</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Year</label>
            <select
              value={year}
              onChange={(e) => onYearChange(e.target.value)}
              className="input-modern rounded-full bg-white/65 py-2.5"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="input-modern rounded-full bg-white/65 py-2.5"
            >
              <option value="title">Title A-Z</option>
              <option value="author">Author A-Z</option>
              <option value="rating">Highest Rated</option>
              <option value="year">Newest First</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
