/**
 * Error handling utilities with custom toast notifications
 */

// Simple toast notification system
let toastContainer: HTMLElement | null = null;

function createToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  const container = createToastContainer();
  
  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    pointer-events: auto;
    font-size: 14px;
    font-weight: 500;
    max-width: 300px;
  `;
  
  toast.textContent = message;
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

/**
 * Handles API errors and displays user-friendly messages
 */
export function handleApiError(error: unknown): void {
  let message = 'An unexpected error occurred';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  showToast(message, 'error');
  console.error('API Error:', error);
}

/**
 * Shows a success message to the user
 */
export function showSuccess(message: string): void {
  showToast(message, 'success');
  console.log('Success:', message);
}
