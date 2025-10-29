export type ToastType = 'success' | 'error' | 'info' | 'warning';

export default interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration?: number;
}
