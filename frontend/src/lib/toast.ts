import React from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'custom';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  id?: string;
  title?: string;
  duration?: number; // ms, default: 4000
  action?: ToastAction;
  icon?: React.ReactNode;
}

export interface ToastItem extends ToastOptions {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();
  private maxToasts = 5;

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  public subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public add(type: ToastType, message: string, options?: ToastOptions): string {
    const id = options?.id || `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const duration = options?.duration !== undefined ? options.duration : 4200;

    const newToast: ToastItem = {
      id,
      message,
      type,
      title: options?.title,
      duration,
      action: options?.action,
      icon: options?.icon,
      createdAt: Date.now(),
    };

    // Keep only the most recent toasts to avoid clutter
    this.toasts = [newToast, ...this.toasts.filter((t) => t.id !== id)].slice(0, this.maxToasts);
    this.notify();

    return id;
  }

  public dismiss(id?: string) {
    if (id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    } else {
      this.toasts = this.toasts.slice(1);
    }
    this.notify();
  }

  public clear() {
    this.toasts = [];
    this.notify();
  }
}

const manager = new ToastManager();

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    manager.add('success', message, options),

  error: (message: string, options?: ToastOptions) =>
    manager.add('error', message, options),

  info: (message: string, options?: ToastOptions) =>
    manager.add('info', message, options),

  warning: (message: string, options?: ToastOptions) =>
    manager.add('warning', message, options),

  custom: (message: string, options?: ToastOptions) =>
    manager.add('custom', message, options),

  dismiss: (id?: string) => manager.dismiss(id),

  clear: () => manager.clear(),

  subscribe: (listener: ToastListener) => manager.subscribe(listener),
};

export default toast;
