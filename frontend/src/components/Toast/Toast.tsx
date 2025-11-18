import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { Toast as ToastType } from '../../store/toastStore';
import './styles.css';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export const Toast = ({ toast, onClose }: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = iconMap[toast.type];

  useEffect(() => {
    // Start exit animation slightly before removal
    if (toast.duration && toast.duration > 0) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration - 300);

      return () => clearTimeout(exitTimer);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  return (
    <div
      className={`toast toast--${toast.type} ${isExiting ? 'toast--exiting' : ''}`}
      role="alert"
    >
      <div className="toast__icon">
        <Icon size={20} />
      </div>
      <div className="toast__content">
        <p className="toast__message">{toast.message}</p>
      </div>
      <button
        className="toast__close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

