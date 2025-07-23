import { createContext, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
              toast.type === 'success'
                ? 'ring-cyan-500'
                : toast.type === 'error'
                ? 'ring-red-500'
                : toast.type === 'warning'
                ? 'ring-yellow-500'
                : 'ring-blue-500'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === 'success' && (
                    <div className="h-6 w-6 text-cyan-400">✓</div>
                  )}
                  {toast.type === 'error' && (
                    <div className="h-6 w-6 text-red-400">✕</div>
                  )}
                  {toast.type === 'warning' && (
                    <div className="h-6 w-6 text-yellow-400">⚠</div>
                  )}
                  {toast.type === 'info' && (
                    <div className="h-6 w-6 text-blue-400">ℹ</div>
                  )}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-white">{toast.title}</p>
                  <p className="mt-1 text-sm text-gray-400">{toast.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="rounded-md inline-flex text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    onClick={() =>
                      setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                    }
                  >
                    <span className="sr-only">Close</span>
                    <span className="h-5 w-5" aria-hidden="true">
                      ✕
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
