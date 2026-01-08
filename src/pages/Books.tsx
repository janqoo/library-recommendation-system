import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookSearch } from '@/components/books/BookSearch';
import { VirtualizedBookGrid } from '@/components/books/VirtualizedBookGrid';
import { BookCard } from '@/components/books/BookCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getBooks } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import { Book } from '@/types';
import { handleApiError } from '@/utils/errorHandling';

/**
 * Optimized Books page with performance enhancements:
 * - Debounced search to prevent excessive filtering
 * - Memoized computations to prevent unnecessary re-renders
 * - Virtualized grid for better performance with large datasets
 * - Cached API responses
 */
export function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [minRating, setMinRating] = useState('');
  const [year, setYear] = useState('');

  // Debounce search query to prevent excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize unique genres / years to prevent recalculation
  const uniqueGenres = useMemo(() => {
    return Array.from(new Set(books.map((book) => book.genre))).sort();
  }, [books]);

  const uniqueYears = useMemo(() => {
    return Array.from(new Set(books.map((book) => book.publishedYear)))
      .sort((a, b) => b - a);
  }, [books]);

  // Memoize sorted books to prevent unnecessary sorting
  const sortedBooks = useMemo(() => {
    const sorted = [...books];
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'author':
        return sorted.sort((a, b) => a.author.localeCompare(b.author));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'year':
        return sorted.sort((a, b) => b.publishedYear - a.publishedYear);
      default:
        return sorted;
    }
  }, [books, sortBy]);

  // Memoize filtered books (includes rating + year)
  const filteredBooks = useMemo(() => {
    const min = minRating ? Number(minRating) : null;
    const y = year ? Number(year) : null;

    return sortedBooks.filter((book) => {
      const matchesSearch =
        !debouncedSearchQuery ||
        book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesGenre = !selectedGenre || book.genre === selectedGenre;
      const matchesRating = !min || book.rating >= min;
      const matchesYear = !y || book.publishedYear === y;

      return matchesSearch && matchesGenre && matchesRating && matchesYear;
    });
  }, [sortedBooks, debouncedSearchQuery, selectedGenre, minRating, year]);

  const filteredCount = filteredBooks.length;

  const newArrivals = useMemo(() => {
    const base = filteredBooks.length ? filteredBooks : sortedBooks;
    return base.slice(0, 8);
  }, [filteredBooks, sortedBooks]);

  // Handlers
  const handleSearchSubmit = useCallback(() => {
    // debouncedSearchQuery already handles filtering; submit is just UX.
    return;
  }, []);

  const handleSort = useCallback((value: string) => setSortBy(value), []);
  const handleGenreFilter = useCallback((genre: string) => setSelectedGenre(genre), []);
  const handleMinRating = useCallback((value: string) => setMinRating(value), []);
  const handleYear = useCallback((value: string) => setYear(value), []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-16">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Page heading (reference-style) */}
        <div className="pt-10 pb-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-ink">
            Explore Books
          </h1>
          <p className="mt-3 text-lg text-muted">
            Discover and browse books tailored for your studies.{' '}
            <span className="font-semibold text-ink">{books.length}</span> available.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8">
          <BookSearch
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onSubmitSearch={handleSearchSubmit}
            genres={uniqueGenres}
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreFilter}
            sortBy={sortBy}
            onSortChange={handleSort}
            minRating={minRating}
            onMinRatingChange={handleMinRating}
            year={year}
            years={uniqueYears}
            onYearChange={handleYear}
          />
        </div>

        {/* Main content like the reference: left content + right side panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            {/* Section header */}
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <a
                href="#all-books"
                className="text-sm font-semibold text-muted hover:text-ink"
              >
                See all
              </a>
            </div>

            {/* Horizontal row (matches reference vibe) */}
            <div className="flex gap-6 overflow-x-auto pb-2 -mx-1 px-1">
              {newArrivals.map((b) => (
                <div key={b.id} className="shrink-0 w-[200px] md:w-[210px]">
                  <BookCard book={b} />
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="mt-10 mb-6 h-px bg-line/80" />

            {/* All books */}
            <div id="all-books" className="flex items-end justify-between mb-4">
              <h2 className="text-3xl font-bold">All Books</h2>
              <div className="text-sm text-muted">
                Showing <span className="font-semibold text-ink">{filteredCount}</span> of{' '}
                <span className="font-semibold text-ink">{books.length}</span>
              </div>
            </div>

            <VirtualizedBookGrid
              books={filteredBooks}
              searchQuery={debouncedSearchQuery}
              selectedGenre={selectedGenre}
              minRating={minRating}
              year={year}
              hideSummary
            />
          </div>

          <aside className="lg:col-span-3 space-y-6">
            {/* Top in Psychology */}
            <div className="card-modern p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Top in Psychology</h3>
                <a href="#all-books" className="text-sm font-semibold text-muted hover:text-ink">
                  See all
                </a>
              </div>

              <div className="space-y-4">
                {(() => {
                  const psych = books.filter((b) => b.genre.toLowerCase().includes('psych'));
                  const list = (psych.length ? psych : books)
                    .slice()
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3);

                  return list.map((b) => (
                    <Link
                      key={b.id}
                      to={`/books/${b.id}`}
                      className="group flex gap-3 rounded-xl border border-line/70 bg-white/55 p-3 hover:bg-white/70 transition"
                    >
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="h-16 w-12 rounded-lg object-cover border border-line/70"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://picsum.photos/120/160?random=' + b.id;
                        }}
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-ink line-clamp-2 group-hover:text-wood-700">
                          {b.title}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                          <span>⭐ {b.rating.toFixed(1)}</span>
                          <span className="h-1 w-1 rounded-full bg-line" />
                          <span>{b.publishedYear}</span>
                        </div>
                      </div>
                    </Link>
                  ));
                })()}
              </div>
            </div>

            {/* Collections */}
            <CollectionsCard />
          </aside>
        </div>
      </div>
    </div>
  );
}

/**
 * Small side card that reuses the existing Reading Lists page data.
 * We keep it UI-only (no new data added), so it respects "don't change content".
 */
function CollectionsCard() {
  // Lazy import to avoid touching more files; api.ts already falls back to mock lists.
  const [lists, setLists] = useState<any[]>([]);

  useEffect(() => {
    import('@/services/api')
      .then(({ getReadingLists }) => getReadingLists())
      .then((data) => setLists(data || []))
      .catch(() => setLists([]));
  }, []);

  return (
    <div className="card-modern p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Collections For Students</h3>
        <a href="/reading-lists" className="text-sm font-semibold text-muted hover:text-ink">
          See all
        </a>
      </div>

      <div className="divide-y divide-line/70 rounded-xl border border-line/70 overflow-hidden bg-white/55">
        {lists.length === 0 ? (
          <div className="p-4 text-sm text-muted">No collections yet.</div>
        ) : (
          lists.slice(0, 6).map((l) => (
            <a
              key={l.id}
              href="/reading-lists"
              className="group flex items-center justify-between p-4 hover:bg-white/70 transition"
            >
              <div className="min-w-0">
                <div className="font-semibold text-ink group-hover:text-wood-700 line-clamp-1">
                  {l.name}
                </div>
                <div className="text-xs text-muted mt-1 line-clamp-1">{l.description}</div>
              </div>
              <svg
                className="w-5 h-5 text-muted group-hover:text-ink"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
