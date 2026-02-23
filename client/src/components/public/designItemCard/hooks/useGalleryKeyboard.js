import { useEffect } from 'react';

const useGalleryKeyboard = ({ open, prev, next, onEsc }) => {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onEsc?.();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, prev, next, onEsc]);
};

export default useGalleryKeyboard;