import { useEffect } from 'react';

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const useWheelZoom = ({
  enabled,
  isFs,
  trackRef,
  setZoom,
  setOffset,
}) => {
  useEffect(() => {
    const el = trackRef?.current;

    if (!el) return;
    if (!enabled) return;
    if (!isFs) return;
    if (typeof setZoom !== 'function') return;
    if (typeof setOffset !== 'function') return;

    const handler = (e) => {
      if (e.ctrlKey) return;

      e.preventDefault();

      const rect = el.getBoundingClientRect();

      const cursorX = e.clientX - rect.left - rect.width / 2;
      const cursorY = e.clientY - rect.top - rect.height / 2;

      const factor = e.deltaY < 0 ? 1.12 : 0.88;

      setZoom((prevZoom) => {
        const nextZoom = clamp(
          Number((prevZoom * factor).toFixed(2)),
          ZOOM_MIN,
          ZOOM_MAX
        );

        const zoomRatio = nextZoom / prevZoom;

        setOffset((prevOffset) => ({
          x: prevOffset.x - cursorX * (zoomRatio - 1),
          y: prevOffset.y - cursorY * (zoomRatio - 1),
        }));

        return nextZoom;
      });
    };

    el.addEventListener('wheel', handler, { passive: false });

    return () => {
      el.removeEventListener('wheel', handler);
    };
  }, [enabled, isFs, trackRef, setZoom, setOffset]);
};

export default useWheelZoom;