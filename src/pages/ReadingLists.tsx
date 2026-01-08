import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ViewListBooksModal } from '@/components/books/ViewListBooksModal';
import { createReadingList, updateReadingList, deleteReadingList } from '@/services/api';
import { useReadingLists } from '@/contexts/ReadingListsContext';
import { ReadingList } from '@/types';
import { formatDate } from '@/utils/formatters';
import { handleApiError, showSuccess } from '@/utils/errorHandling';

/**
 * ReadingLists page component with full CRUD functionality
 */
export function ReadingLists() {
  const { lists, isLoading, refreshLists } = useReadingLists();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewBooksModalOpen, setIsViewBooksModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<ReadingList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [editListName, setEditListName] = useState('');
  const [editListDescription, setEditListDescription] = useState('');

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      handleApiError('Please enter a list name');
      return;
    }

    try {
      await createReadingList({
        userId: '1', // TODO: Get from auth context
        name: newListName,
        description: newListDescription,
        bookIds: [],
      });
      await refreshLists(); // Refresh the lists from context
      setIsCreateModalOpen(false);
      setNewListName('');
      setNewListDescription('');
      showSuccess('Reading list created successfully!');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleEditList = async () => {
    if (!selectedList || !editListName.trim()) {
      handleApiError('Please enter a list name');
      return;
    }

    try {
      await updateReadingList(selectedList.id, {
        name: editListName,
        description: editListDescription,
      });
      await refreshLists(); // Refresh the lists from context
      setIsEditModalOpen(false);
      setSelectedList(null);
      showSuccess('Reading list updated successfully!');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteList = async () => {
    if (!selectedList) return;

    try {
      await deleteReadingList(selectedList.id);
      await refreshLists(); // Refresh the lists from context
      setIsDeleteModalOpen(false);
      setSelectedList(null);
      showSuccess('Reading list deleted successfully!');
    } catch (error) {
      handleApiError(error);
    }
  };

  const openViewBooksModal = (list: ReadingList) => {
    setSelectedList(list);
    setIsViewBooksModalOpen(true);
  };

  // Get the current version of the selected list from the context
  const getCurrentSelectedList = () => {
    if (!selectedList) return null;
    return lists.find(list => list.id === selectedList.id) || selectedList;
  };

  const openEditModal = (list: ReadingList) => {
    setSelectedList(list);
    setEditListName(list.name);
    setEditListDescription(list.description);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (list: ReadingList) => {
    setSelectedList(list);
    setIsDeleteModalOpen(true);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">My Reading Lists</h1>
            <p className="text-slate-600 text-lg">Organize your books into custom lists</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setIsCreateModalOpen(true)}>
            Create New List
          </Button>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200">
            <svg
              className="w-16 h-16 text-slate-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No reading lists yet</h3>
            <p className="text-slate-600 mb-4">
              Create your first list to start organizing your books
            </p>
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              Create Your First List
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <div
                key={list.id}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:border-violet-300 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-slate-900 flex-1 mr-2">{list.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(list)}
                      className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                      title="Edit list"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(list)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete list"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4 line-clamp-2 min-h-[3rem]">
                  {list.description || 'No description'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {list.bookIds.length} books
                  </span>
                  <span>Created {formatDate(list.createdAt)}</span>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    openViewBooksModal(list);
                  }}
                >
                  View Books ({list.bookIds.length})
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Create List Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Reading List"
        >
          <div>
            <Input
              label="List Name"
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="e.g., Summer Reading 2024"
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                placeholder="What's this list about?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[100px] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="primary" onClick={handleCreateList} className="flex-1">
                Create List
              </Button>
              <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit List Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Reading List"
        >
          <div>
            <Input
              label="List Name"
              type="text"
              value={editListName}
              onChange={(e) => setEditListName(e.target.value)}
              placeholder="e.g., Summer Reading 2024"
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={editListDescription}
                onChange={(e) => setEditListDescription(e.target.value)}
                placeholder="What's this list about?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[100px] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="primary" onClick={handleEditList} className="flex-1">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Reading List"
        >
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Are you sure?</h3>
                  <p className="text-slate-600">This action cannot be undone.</p>
                </div>
              </div>
              
              {selectedList && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">You're about to delete:</p>
                  <p className="font-semibold text-slate-900">"{selectedList.name}"</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedList.bookIds.length} books will be removed from this list
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="danger" onClick={handleDeleteList} className="flex-1">
                Delete List
              </Button>
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* View Books Modal */}
        {selectedList && (
          <ViewListBooksModal
            isOpen={isViewBooksModalOpen}
            onClose={() => setIsViewBooksModalOpen(false)}
            readingList={getCurrentSelectedList()!}
          />
        )}
      </div>
    </div>
  );
}
