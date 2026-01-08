import React, { createContext, useState, useEffect, useContext } from 'react';
import { Book } from '@/types';

/**
 * Favorites context type definition
 */
export interface FavoritesContextType {
  favorites: Book[];
  addToFavorites: (book: Book) => void;
  removeFromFavorites: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  toggleFavorite: (book: Book) => void;
}

/**
 * Favorites context
 */
export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

/**
 * FavoritesProvider component props
 */
interface FavoritesProviderProps {
  children: React.ReactNode;
}

/**
 * ============================================================================
 * FAVORITES CONTEXT - LOCAL STORAGE IMPLEMENTATION
 * ============================================================================
 *
 * ✅ IMPLEMENTED: Simple favorites management
 * - Add/remove books from favorites
 * - Persist favorites in localStorage
 * - Check if book is favorited
 * - Toggle favorite status
 *
 * Future Enhancement: Could be upgraded to use backend storage
 * ============================================================================
 */
export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Book[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('library-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('library-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (book: Book) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === book.id)) {
        return prev; // Already in favorites
      }
      return [...prev, book];
    });
  };

  const removeFromFavorites = (bookId: string) => {
    setFavorites(prev => prev.filter(book => book.id !== bookId));
  };

  const isFavorite = (bookId: string): boolean => {
    return favorites.some(book => book.id === bookId);
  };

  const toggleFavorite = (book: Book) => {
    if (isFavorite(book.id)) {
      removeFromFavorites(book.id);
    } else {
      addToFavorites(book);
    }
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Hook to use favorites context
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}