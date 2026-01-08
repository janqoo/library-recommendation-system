import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '@/types';
import { formatRating } from '@/utils/formatters';
import { Button } from '@/components/common/Button';
import { useFavorites } from '@/contexts/FavoritesContext';
import { AddToListModal } from './AddToListModal';

/**
 * BookCard component props
 */
interface BookCardProps {
  book: Book;
}

/**
 * Modern BookCard with beautiful hover effects and gradients
 * Optimized with React.memo to prevent unnecessary re-renders
 *
 * @example
 * <BookCard book={book} />
 */
const BookCard = memo(function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showAddToListModal, setShowAddToListModal] = useState(false);

  const handleClick = () => {
    navigate(`/books/${book.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(book);
  };

  const handleAddToListClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddToListModal(true);
  };

  const roundedStars = Math.round(book.rating);

  return (
    <>
      <div
        className="group cursor-pointer rounded-2xl border border-line/80 bg-white/60 p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
        onClick={handleClick}
      >
        {/* Cover */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden border border-line/70 bg-paper2">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full aspect-[3/4] object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = 'https://picsum.photos/300/400?random=' + book.id;
              }}
            />
          </div>

          {/* Favorite */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 left-3 grid h-9 w-9 place-items-center rounded-full border border-line/70 bg-white/75 backdrop-blur-sm transition hover:bg-white/90 ${
              isFavorite(book.id) ? 'text-rose-600' : 'text-muted hover:text-rose-600'
            }`}
            aria-label={isFavorite(book.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className="w-5 h-5"
              fill={isFavorite(book.id) ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Quick actions (kept, but subtle) */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToListClick}
              className="grid h-9 w-9 place-items-center rounded-full border border-line/70 bg-white/75 backdrop-blur-sm text-ink hover:bg-white/90"
              title="Add to List"
              aria-label="Add to List"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="grid h-9 w-9 place-items-center rounded-full border border-line/70 bg-white/75 backdrop-blur-sm text-ink hover:bg-white/90"
              title="View Details"
              aria-label="View Details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pt-4">
          <h3 className="text-base font-semibold text-ink line-clamp-2 group-hover:text-wood-800 transition-colors">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-muted line-clamp-1">{book.author}</p>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5" aria-label={`Rating ${formatRating(book.rating)}`}>
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < roundedStars;
                return (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${filled ? 'text-wood-500' : 'text-line'}`}
                    fill={filled ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              })}
            </div>
            <span className="text-sm font-semibold text-ink">{formatRating(book.rating)}</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="badge-modern">{book.genre}</span>
            <span className="badge-glass">{book.publishedYear}</span>
          </div>

          {/* Keep the original actions (but minimal) */}
          <div className="mt-4 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              className="w-full rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              View
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="w-full rounded-xl"
              onClick={handleAddToListClick}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Add to List Modal */}
      <AddToListModal
        isOpen={showAddToListModal}
        onClose={() => setShowAddToListModal(false)}
        book={book}
      />
    </>
  );
});

export { BookCard };
