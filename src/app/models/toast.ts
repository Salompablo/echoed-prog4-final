export type ToastType = 'success' | 'error' | 'info' | 'warning';

export default interface ToastInfo {
  id: number;
  type: ToastType;
  message: string;
  duration?: number;
}
