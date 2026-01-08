import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useReadingLists } from '@/contexts/ReadingListsContext';
import { Book } from '@/types';

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
}

export function AddToListModal({ isOpen, onClose, book }: AddToListModalProps) {
  const { lists, isLoading, addBookToList, isBookInList } = useReadingLists();
  const [addingToList, setAddingToList] = useState<string | null>(null);

  const handleAddToList = async (listId: string) => {
    setAddingToList(listId);
    try {
      await addBookToList(book.id, listId);
      // Don't close modal immediately so user can add to multiple lists
    } finally {
      setAddingToList(null);
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Add to Reading List">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Reading List">
      <div>
        {/* Book Info */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-16 h-20 object-cover rounded-lg shadow-sm"
            onError={(e) => {
              e.currentTarget.src = 'https://picsum.photos/300/400?random=' + book.id;
            }}
          />
          <div>
            <h3 className="font-semibold text-slate-900 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-slate-600">{book.author}</p>
            <p className="text-xs text-slate-500">{book.genre}</p>
          </div>
        </div>

        {/* Reading Lists */}
        {lists.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Reading Lists</h3>
            <p className="text-slate-600 mb-4">Create your first reading list to start organizing books.</p>
            <Button variant="primary" onClick={onClose}>
              Go to Reading Lists
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {lists.map((list) => {
              const bookInList = isBookInList(book.id, list.id);
              const isAdding = addingToList === list.id;
              
              return (
                <div
                  key={list.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    bookInList 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-slate-200 hover:border-violet-300'
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{list.name}</h4>
                    <p className="text-sm text-slate-600 line-clamp-1">{list.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {list.bookIds.length} book{list.bookIds.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="ml-4">
                    {bookInList ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Added</span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToList(list.id)}
                        disabled={isAdding}
                      >
                        {isAdding ? (
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            Adding...
                          </div>
                        ) : (
                          'Add'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            You can add this book to multiple lists
          </p>
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}