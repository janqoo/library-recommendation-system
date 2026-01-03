import { Book, ReadingList, Review, Recommendation } from '@/types';
import { mockBooks, mockReadingLists } from './mockData';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * ============================================================================
 * API SERVICE LAYER - BACKEND COMMUNICATION
 * ============================================================================
 *
 * ⚠️ IMPORTANT: This file currently uses MOCK DATA for all API calls.
 *
 * TO IMPLEMENT AWS BACKEND:
 * Follow the step-by-step guide in IMPLEMENTATION_GUIDE.md
 *
 * Quick Reference:
 * - Week 2: Implement Books API (getBooks, getBook, createBook, etc.)
 * - Week 2: Implement Reading Lists API
 * - Week 3: Add Cognito authentication headers
 * - Week 4: Implement AI recommendations with Bedrock
 *
 * ============================================================================
 * IMPLEMENTATION CHECKLIST:
 * ============================================================================
 *
 * [ ] Week 1: Set up AWS account and first Lambda function
 * [ ] Week 2: Create DynamoDB tables (Books, ReadingLists)
 * [ ] Week 2: Deploy Lambda functions for Books API
 * [ ] Week 2: Deploy Lambda functions for Reading Lists API
 * [ ] Week 2: Set VITE_API_BASE_URL in .env file
 * [ ] Week 3: Set up Cognito User Pool
 * [ ] Week 3: Install aws-amplify: npm install aws-amplify
 * [ ] Week 3: Configure Amplify in src/main.tsx
 * [ ] Week 3: Update AuthContext with Cognito functions
 * [ ] Week 3: Implement getAuthHeaders() function below
 * [ ] Week 3: Add Cognito authorizer to API Gateway
 * [ ] Week 4: Deploy Bedrock recommendations Lambda
 * [ ] Week 4: Update getRecommendations() function
 * [ ] Week 4: Remove all mock data returns
 * [ ] Week 4: Delete src/services/mockData.ts
 *
 * ============================================================================
 */

// API Gateway URL - connected to your Lambda functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Get authentication headers with JWT token from Cognito
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  } catch {
    return {
      'Content-Type': 'application/json'
    };
  }
}

/**
 * Get all books from the catalog
 *
 * TODO: Replace with real API call in Week 2, Day 3-4
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-books (see IMPLEMENTATION_GUIDE.md)
 * 2. Create API Gateway endpoint: GET /books
 * 3. Uncomment API_BASE_URL at top of file
 * 4. Replace mock code below with:
 *
 * const response = await fetch(`${API_BASE_URL}/books`);
 * if (!response.ok) throw new Error('Failed to fetch books');
 * return response.json();
 *
 * Expected response: Array of Book objects from DynamoDB
 */
export async function getBooks(): Promise<Book[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) throw new Error('Failed to fetch books');
    const data = await response.json();
    return data.books || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    // Fallback to mock data if API fails
    return mockBooks;
  }
}

/**
 * Get a single book by ID
 *
 * TODO: Replace with real API call in Week 2, Day 3-4
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-book (see IMPLEMENTATION_GUIDE.md)
 * 2. Create API Gateway endpoint: GET /books/{id}
 * 3. Replace mock code below with:
 *
 * const response = await fetch(`${API_BASE_URL}/books/${id}`);
 * if (response.status === 404) return null;
 * if (!response.ok) throw new Error('Failed to fetch book');
 * return response.json();
 *
 * Expected response: Single Book object or null if not found
 */
export async function getBook(id: string): Promise<Book | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch book');
    const data = await response.json();
    return data.book || null;
  } catch (error) {
    console.error('Error fetching book:', error);
    // Fallback to mock data if API fails
    const book = mockBooks.find((b) => b.id === id);
    return book || null;
  }
}

/**
 * Create a new book (admin only)
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-create-book
 * 2. Create API Gateway endpoint: POST /books
 * 3. Add Cognito authorizer (Week 3)
 * 4. Replace mock code below with:
 *
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${API_BASE_URL}/books`, {
 *   method: 'POST',
 *   headers,
 *   body: JSON.stringify(book)
 * });
 * if (!response.ok) throw new Error('Failed to create book');
 * return response.json();
 *
 * Note: This endpoint requires admin role in Cognito
 */
export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  // TODO: Remove this mock implementation after deploying Lambda
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBook: Book = {
        ...book,
        id: Date.now().toString(),
      };
      resolve(newBook);
    }, 500);
  });
}

/**
 * Update an existing book (admin only)
 * TODO: Replace with PUT /books/:id API call
 */
export async function updateBook(id: string, book: Partial<Book>): Promise<Book> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingBook = mockBooks.find((b) => b.id === id);
      const updatedBook: Book = {
        ...existingBook!,
        ...book,
        id,
      };
      resolve(updatedBook);
    }, 500);
  });
}

/**
 * Delete a book (admin only)
 * TODO: Replace with DELETE /books/:id API call
 */
export async function deleteBook(): Promise<void> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
}

/**
 * Get AI-powered book recommendations using Amazon Bedrock
 */
export async function getRecommendations(query: string): Promise<Recommendation[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the AI response to match our Recommendation type
    if (data.recommendations && Array.isArray(data.recommendations)) {
      return data.recommendations.map((rec: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        bookId: `ai-book-${index}`, // We'll use a placeholder since AI returns new books
        reason: rec.reason || 'AI-powered recommendation',
        confidence: rec.confidence || 0.8,
        // Store AI book data for display
        aiBook: {
          title: rec.title,
          author: rec.author,
          reason: rec.reason
        }
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    // Fallback to mock data if API fails
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockRecommendations: Recommendation[] = [
          {
            id: '1',
            bookId: '1',
            reason: 'Based on your interest in philosophical fiction, this book explores themes of choice and regret.',
            confidence: 0.92,
          },
          {
            id: '2',
            bookId: '2',
            reason: 'If you enjoy science-based thrillers, this space adventure combines humor with hard science.',
            confidence: 0.88,
          },
        ];
        resolve(mockRecommendations);
      }, 1000);
    });
  }
}

/**
 * Get user's reading lists
 */
export async function getReadingLists(): Promise<ReadingList[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reading-lists`);
    if (!response.ok) throw new Error('Failed to fetch reading lists');
    const data = await response.json();
    return data.readingLists || [];
  } catch (error) {
    console.error('Error fetching reading lists:', error);
    // Fallback to mock data if API fails
    return mockReadingLists;
  }
}

/**
 * Create a new reading list
 */
export async function createReadingList(
  list: Omit<ReadingList, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ReadingList> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/reading-lists`, {
      method: 'POST',
      headers,
      body: JSON.stringify(list)
    });
    if (!response.ok) throw new Error('Failed to create reading list');
    const data = await response.json();
    return data.readingList;
  } catch (error) {
    console.error('Error creating reading list:', error);
    // Fallback to mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newList: ReadingList = {
          ...list,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        resolve(newList);
      }, 500);
    });
  }
}

/**
 * Update a reading list
 */
export async function updateReadingList(
  id: string,
  list: Partial<ReadingList>
): Promise<ReadingList> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/reading-lists/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(list)
    });
    if (!response.ok) throw new Error('Failed to update reading list');
    const data = await response.json();
    return data.readingList;
  } catch (error) {
    console.error('Error updating reading list:', error);
    // Fallback to mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingList = mockReadingLists.find((l) => l.id === id);
        const updatedList: ReadingList = {
          ...existingList!,
          ...list,
          id,
          updatedAt: new Date().toISOString(),
        };
        resolve(updatedList);
      }, 500);
    });
  }
}

/**
 * Delete a reading list
 */
export async function deleteReadingList(id: string): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/reading-lists/${id}?userId=1`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Failed to delete reading list');
  } catch (error) {
    console.error('Error deleting reading list:', error);
    // Fallback to mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  }
}

/**
 * Get reviews for a book
 * TODO: Replace with GET /books/:id/reviews API call
 */
export async function getReviews(bookId: string): Promise<Review[]> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockReviews: Review[] = [
        {
          id: '1',
          bookId,
          userId: '1',
          rating: 5,
          comment: 'Absolutely loved this book! A must-read.',
          createdAt: '2024-11-01T10:00:00Z',
        },
      ];
      resolve(mockReviews);
    }, 500);
  });
}

/**
 * Create a new review
 * TODO: Replace with POST /books/:bookId/reviews API call
 */
export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      resolve(newReview);
    }, 500);
  });
}
