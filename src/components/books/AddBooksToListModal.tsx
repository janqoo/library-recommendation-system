import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useReadingLists } from '@/contexts/ReadingListsContext';
import { getBooks } from '@/services/api';
import { ReadingList, Book } from '@/types';
import { formatRating } from '@/utils/formatters';
import { handleApiError, showSuccess } from '@/utils/errorHandling';

interface AddBooksToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  readingList: ReadingList;
  onBooksAdded?: () => void;
}

export function AddBooksToListModal({ isOpen, onClose, readingList, onBooksAdded }: AddBooksToListModalProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addBooksToList } = useReadingLists();

  useEffect(() => {
    if (isOpen) {
      loadBooks();
      setSearchQuery('');
      setSelectedBooks(new Set());
    }
  }, [isOpen]);

  useEffect(() => {
    // Filter books based on search query and exclude books already in the list
    const availableBooks = books.filter(book => 
      !readingList.bookIds.includes(book.id)
    );

    if (searchQuery.trim() === '') {
      setFilteredBooks(availableBooks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = availableBooks.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
      );
      setFilteredBooks(filtered);
    }
  }, [books, searchQuery, readingList.bookIds]);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const allBooks = await getBooks();
      setBooks(allBooks);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookSelection = (bookId: string) => {
    const newSelection = new Set(selectedBooks);
    if (newSelection.has(bookId)) {
      newSelection.delete(bookId);
    } else {
      newSelection.add(bookId);
    }
    setSelectedBooks(newSelection);
  };

  const handleAddBooks = async () => {
    if (selectedBooks.size === 0) {
      handleApiError('Please select at least one book');
      return;
    }

    setIsAdding(true);
    try {
      await addBooksToList(Array.from(selectedBooks), readingList.id);
      showSuccess(`Added ${selectedBooks.size} book${selectedBooks.size > 1 ? 's' : ''} to "${readingList.name}"`);
      
      // Call the callback to refresh the parent component immediately
      if (onBooksAdded) {
        onBooksAdded();
      }
      
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsAdding(false);
    }
  };

  const selectAll = () => {
    setSelectedBooks(new Set(filteredBooks.map(book => book.id)));
  };

  const clearSelection = () => {
    setSelectedBooks(new Set());
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Add Books to "${readingList.name}"`} size="xl">
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
      title={`Add Books to "${readingList.name}"`}
      size="xl"
    >
      <div>
        {/* Search and Controls */}
        <div className="mb-6">
          <Input
            label="Search Books"
            type="text"
            placeholder="Search books by title, author, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll} disabled={filteredBooks.length === 0}>
                Select All ({filteredBooks.length})
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection} disabled={selectedBooks.size === 0}>
                Clear Selection
              </Button>
            </div>
            <p className="text-sm text-slate-600">
              {selectedBooks.size} book{selectedBooks.size !== 1 ? 's' : ''} selected
            </p>
          </div>
        </div>

        {/* Books Grid */}
        <div className="max-h-96 overflow-y-auto">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {searchQuery ? 'No books found' : 'All books are already in this list'}
              </h3>
              <p className="text-slate-600">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'This reading list contains all available books'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => {
                const isSelected = selectedBooks.has(book.id);
                return (
                  <div
                    key={book.id}
                    className={`relative bg-white rounded-xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-50' 
                        : 'border-slate-200 hover:border-violet-300'
                    }`}
                    onClick={() => toggleBookSelection(book.id)}
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-violet-500 border-violet-500' 
                          : 'bg-white/90 border-slate-300 backdrop-blur-sm'
                      }`}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Book Cover */}
                    <div className="relative">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-40 object-cover"
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
                    </div>

                    {/* Book Info */}
                    <div className="p-3">
                      <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-1">
                        {book.title}
                      </h4>
                      <p className="text-xs text-slate-600 mb-2">{book.author}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                          {book.genre}
                        </span>
                        <span className="text-xs text-slate-500">{book.publishedYear}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} available to add
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddBooks}
              disabled={selectedBooks.size === 0 || isAdding}
            >
              {isAdding ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Adding...</span>
                </>
              ) : (
                `Add ${selectedBooks.size} Book${selectedBooks.size !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}