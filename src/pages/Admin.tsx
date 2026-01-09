import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getBooks, createBook, deleteBook } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Book } from '@/types';
import { handleApiError, showSuccess } from '@/utils/errorHandling';

/**
 * Admin page component for managing books and viewing metrics
 * Only accessible to users with admin role
 */
export function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    coverImage: '',
    rating: 0,
    publishedYear: new Date().getFullYear(),
    isbn: '',
  });

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

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
            <p className="text-slate-600 mb-6">
              This admin panel is restricted to Okan University students and staff. Please sign in with your <strong>@stu.okan.edu.tr</strong> email address to access administrative features.
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => window.history.back()}
                className="w-full"
              >
                Go Back
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateBook = async () => {
    if (!newBook.title || !newBook.author) {
      handleApiError('Please fill in required fields (Title and Author)');
      return;
    }

    try {
      const created = await createBook(newBook);
      setBooks([...books, created]);
      setIsModalOpen(false);
      resetForm();
      showSuccess('Book added successfully!');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return;
    
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) {
      return;
    }

    try {
      await deleteBook();
      setBooks(books.filter((book) => book.id !== id));
      showSuccess('Book deleted successfully!');
    } catch (error) {
      handleApiError(error);
    }
  };

  const resetForm = () => {
    setNewBook({
      title: '',
      author: '',
      genre: '',
      description: '',
      coverImage: '',
      rating: 0,
      publishedYear: new Date().getFullYear(),
      isbn: '',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 text-lg">Manage books and view system metrics</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Total Books</h3>
            <p className="text-5xl font-bold">{books.length}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Total Users</h3>
            <p className="text-5xl font-bold">42</p>
            <p className="text-sm mt-1 opacity-75">Placeholder data</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Active Reading Lists</h3>
            <p className="text-5xl font-bold">18</p>
            <p className="text-sm mt-1 opacity-75">Placeholder data</p>
          </div>
        </div>

        {/* Books Management */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Manage Books</h2>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Add New Book
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Author</th>
                  <th className="text-left py-3 px-4">Genre</th>
                  <th className="text-left py-3 px-4">Rating</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4">{book.title}</td>
                    <td className="py-3 px-4">{book.author}</td>
                    <td className="py-3 px-4">{book.genre}</td>
                    <td className="py-3 px-4">{book.rating}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Book Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Book">
          <div className="max-h-[60vh] overflow-y-auto">
            <Input
              label="Title"
              type="text"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
            />

            <Input
              label="Author"
              type="text"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
            />

            <Input
              label="Genre"
              type="text"
              value={newBook.genre}
              onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px] resize-none"
              />
            </div>

            <Input
              label="Cover Image URL"
              type="text"
              value={newBook.coverImage}
              onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
            />

            <Input
              label="Rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={newBook.rating}
              onChange={(e) => setNewBook({ ...newBook, rating: parseFloat(e.target.value) })}
            />

            <Input
              label="Published Year"
              type="number"
              value={newBook.publishedYear}
              onChange={(e) => setNewBook({ ...newBook, publishedYear: parseInt(e.target.value) })}
            />

            <Input
              label="ISBN"
              type="text"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
            />

            <div className="flex gap-3 mt-6">
              <Button variant="primary" onClick={handleCreateBook} className="flex-1">
                Add Book
              </Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
