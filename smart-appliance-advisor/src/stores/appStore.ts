/**
 * 全域應用程式狀態管理（Zustand）
 * 管理載入狀態、Toast 通知、全域 UI 狀態
 */

import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface AppStore {
  // 載入狀態
  isLoading: boolean;
  loadingMessage: string;
  
  // Toast 通知
  toasts: Toast[];
  
  // Actions：載入狀態
  setLoading: (loading: boolean, message?: string) => void;
  
  // Actions：Toast 通知
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

let toastIdCounter = 0;

export const useAppStore = create<AppStore>((set) => ({
  // 初始狀態
  isLoading: false,
  loadingMessage: '',
  toasts: [],
  
  // 載入狀態
  setLoading: (loading, message = '') =>
    set({ isLoading: loading, loadingMessage: message }),
  
  // Toast 通知
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${toastIdCounter++}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 3000,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    // 自動移除 Toast
    if (newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }
  },
  
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  
  clearToasts: () => set({ toasts: [] }),
}));

// 便利函式：快速顯示 Toast
export const showToast = {
  success: (message: string, duration?: number) => {
    useAppStore.getState().addToast({ message, type: 'success', duration });
  },
  error: (message: string, duration?: number) => {
    useAppStore.getState().addToast({ message, type: 'error', duration });
  },
  warning: (message: string, duration?: number) => {
    useAppStore.getState().addToast({ message, type: 'warning', duration });
  },
  info: (message: string, duration?: number) => {
    useAppStore.getState().addToast({ message, type: 'info', duration });
  },
};
