import { useMemo } from 'react';
import { Book } from '@/types';
import { BookCard } from './BookCard';

interface VirtualizedBookGridProps {
  books: Book[];
  searchQuery?: string;
  selectedGenre?: string;
  minRating?: string;
  year?: string;
  hideSummary?: boolean;
}

/**
 * Optimized book grid with search and filtering
 * Uses useMemo to prevent unnecessary re-computations
 */
export function VirtualizedBookGrid({
  books,
  searchQuery = '',
  selectedGenre = '',
  minRating = '',
  year = '',
  hideSummary = false,
}: VirtualizedBookGridProps) {
  // Memoize filtered books to prevent re-computation on every render
  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const min = minRating ? Number(minRating) : null;
    const y = year ? Number(year) : null;

    return books.filter((book) => {
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.genre.toLowerCase().includes(q);

      const matchesGenre = !selectedGenre || book.genre === selectedGenre;
      const matchesRating = !min || book.rating >= min;
      const matchesYear = !y || book.publishedYear === y;

      return matchesSearch && matchesGenre && matchesRating && matchesYear;
    });
  }, [books, searchQuery, selectedGenre, minRating, year]);

  return (
    <div>
      {!hideSummary && (
        <div className="mb-4 text-sm text-muted">
          Showing <span className="font-semibold text-ink">{filteredBooks.length}</span> of{' '}
          <span className="font-semibold text-ink">{books.length}</span>
          {searchQuery && (
            <>
              {' '}• Search: <span className="font-semibold text-ink">"{searchQuery}"</span>
            </>
          )}
          {selectedGenre && (
            <>
              {' '}• Genre: <span className="font-semibold text-ink">{selectedGenre}</span>
            </>
          )}
          {minRating && (
            <>
              {' '}• Rating: <span className="font-semibold text-ink">{minRating}+</span>
            </>
          )}
          {year && (
            <>
              {' '}• Year: <span className="font-semibold text-ink">{year}</span>
            </>
          )}
        </div>
      )}

      {/* Optimized Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-semibold text-ink mb-2">No Books Found</h3>
          <p className="text-muted">
            {searchQuery ? `No books match "${searchQuery}"` : 'No books available'}
          </p>
        </div>
      )}
    </div>
  );
}