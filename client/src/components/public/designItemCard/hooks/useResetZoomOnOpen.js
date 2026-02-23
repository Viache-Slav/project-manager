import { useEffect } from 'react';

const useResetZoomOnOpen = ({ open, activeIndex, resetZoom }) => {
  useEffect(() => {
    if (!open) return;
    resetZoom();
  }, [open, activeIndex, resetZoom]);
};

export default useResetZoomOnOpen;