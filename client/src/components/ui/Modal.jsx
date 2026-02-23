import { createPortal } from 'react-dom';
import { useEffect } from 'react';

const Modal = ({ open, onClose, children }) => {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[20]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="relative max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-auto pointer-events-auto">

          <div className="max-h-[90vh] overflow-auto no-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;