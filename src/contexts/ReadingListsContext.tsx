import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ReadingList } from '@/types';
import { getReadingLists, updateReadingList } from '@/services/api';
import { handleApiError, showSuccess } from '@/utils/errorHandling';

interface ReadingListsContextType {
  lists: ReadingList[];
  isLoading: boolean;
  refreshLists: () => Promise<void>;
  addBookToList: (bookId: string, listId: string) => Promise<void>;
  addBooksToList: (bookIds: string[], listId: string) => Promise<void>;
  removeBookFromList: (bookId: string, listId: string) => Promise<void>;
  isBookInList: (bookId: string, listId: string) => boolean;
}

const ReadingListsContext = createContext<ReadingListsContextType | undefined>(undefined);

interface ReadingListsProviderProps {
  children: ReactNode;
}

export function ReadingListsProvider({ children }: ReadingListsProviderProps) {
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshLists = async () => {
    setIsLoading(true);
    try {
      const data = await getReadingLists();
      setLists(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBookToList = async (bookId: string, listId: string) => {
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) {
        throw new Error('Reading list not found');
      }

      if (list.bookIds.includes(bookId)) {
        showSuccess('Book is already in this list!');
        return;
      }

      const updatedBookIds = [...list.bookIds, bookId];
      const updatedList = await updateReadingList(listId, {
        bookIds: updatedBookIds
      });

      setLists(lists.map(l => l.id === listId ? updatedList : l));
      showSuccess(`Book added to "${list.name}"!`);
    } catch (error) {
      handleApiError(error);
    }
  };

  const addBooksToList = async (bookIds: string[], listId: string) => {
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) {
        throw new Error('Reading list not found');
      }

      // Filter out books that are already in the list
      const newBookIds = bookIds.filter(bookId => !list.bookIds.includes(bookId));
      
      if (newBookIds.length === 0) {
        showSuccess('All selected books are already in this list!');
        return;
      }

      const updatedBookIds = [...list.bookIds, ...newBookIds];
      const updatedList = await updateReadingList(listId, {
        bookIds: updatedBookIds
      });

      setLists(lists.map(l => l.id === listId ? updatedList : l));
    } catch (error) {
      handleApiError(error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  const removeBookFromList = async (bookId: string, listId: string) => {
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) {
        throw new Error('Reading list not found');
      }

      const updatedBookIds = list.bookIds.filter(id => id !== bookId);
      const updatedList = await updateReadingList(listId, {
        bookIds: updatedBookIds
      });

      setLists(lists.map(l => l.id === listId ? updatedList : l));
      showSuccess(`Book removed from "${list.name}"!`);
    } catch (error) {
      handleApiError(error);
    }
  };

  const isBookInList = (bookId: string, listId: string): boolean => {
    const list = lists.find(l => l.id === listId);
    return list ? list.bookIds.includes(bookId) : false;
  };

  useEffect(() => {
    refreshLists();
  }, []);

  const value: ReadingListsContextType = {
    lists,
    isLoading,
    refreshLists,
    addBookToList,
    addBooksToList,
    removeBookFromList,
    isBookInList,
  };

  return (
    <ReadingListsContext.Provider value={value}>
      {children}
    </ReadingListsContext.Provider>
  );
}

export function useReadingLists() {
  const context = useContext(ReadingListsContext);
  if (context === undefined) {
    throw new Error('useReadingLists must be used within a ReadingListsProvider');
  }
  return context;
}