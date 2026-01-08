import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AddBooksToListModal } from './AddBooksToListModal';
import { useReadingLists } from '@/contexts/ReadingListsContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { getBook } from '@/services/api';
import { ReadingList, Book } from '@/types';
import { formatRating } from '@/utils/formatters';
import { handleApiError } from '@/utils/errorHandling';

interface ViewListBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  readingList: ReadingList;
}

export function ViewListBooksModal({ isOpen, onClose, readingList }: ViewListBooksModalProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddBooksModalOpen, setIsAddBooksModalOpen] = useState(false);
  const { removeBookFromList, refreshLists } = useReadingLists();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && readingList.bookIds.length > 0) {
      loadBooks();
    } else if (isOpen && readingList.bookIds.length === 0) {
      setBooks([]); // Clear books if list is empty
    }
  }, [isOpen, readingList.bookIds]); // Add readingList.bookIds as dependency

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const bookPromises = readingList.bookIds.map(bookId => getBook(bookId));
      const bookResults = await Promise.all(bookPromises);
      const validBooks = bookResults.filter((book): book is Book => book !== null);
      setBooks(validBooks);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    await removeBookFromList(bookId, readingList.id);
    setBooks(books.filter(book => book.id !== bookId));
  };

  const handleBooksAdded = async () => {
    // Refresh both the books and the reading list data
    await refreshLists(); // This will update the readingList prop with new bookIds
    await loadBooks(); // This will reload the books based on updated bookIds
  };

  const handleViewDetails = (bookId: string) => {
    onClose(); // Close the modal first
    navigate(`/books/${bookId}`); // Navigate to book details page
  };

  const handleFavoriteClick = (book: Book) => {
    toggleFavorite(book);
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Books in "${readingList.name}"`}>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Books in "${readingList.name}"`}
      size="xl"
    >
      <div>
        {/* List Info */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900">{readingList.name}</h3>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setIsAddBooksModalOpen(true)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Books
            </Button>
          </div>
          <p className="text-sm text-slate-600 mb-2">{readingList.description}</p>
          <p className="text-xs text-slate-500">
            {readingList.bookIds.length} book{readingList.bookIds.length !== 1 ? 's' : ''} in this list
          </p>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Books Yet</h3>
            <p className="text-slate-600 mb-4">This reading list is empty. Add some books to get started!</p>
            <Button variant="primary" onClick={() => setIsAddBooksModalOpen(true)}>
              Add Books
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Book Cover */}
                <div className="relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://picsum.photos/300/400?random=' + book.id;
                    }}
                  />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                      <div className="flex items-center">
                        <svg className="w-3 h-3 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold text-slate-900">{formatRating(book.rating)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Favorite Heart */}
                  <div className="absolute top-2 left-2">
                    <button
                      onClick={() => handleFavoriteClick(book)}
                      className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                        isFavorite(book.id)
                          ? 'bg-red-500/90 text-white shadow-sm'
                          : 'bg-white/90 text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
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
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-1">
                    {book.title}
                  </h4>
                  <p className="text-xs text-slate-600 mb-2">{book.author}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                      {book.genre}
                    </span>
                    <span className="text-xs text-slate-500">{book.publishedYear}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleViewDetails(book.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleRemoveBook(book.id)}
                      title="Remove from list"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            {books.length} of {readingList.bookIds.length} books loaded
          </p>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Add Books Modal */}
      <AddBooksToListModal
        isOpen={isAddBooksModalOpen}
        onClose={() => setIsAddBooksModalOpen(false)}
        readingList={readingList}
        onBooksAdded={handleBooksAdded}
      />
    </Modal>
  );
}