import { useMemo, useRef, useState, useCallback } from 'react';

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const useZoomDrag = ({ enabled, containerRef }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const getBounds = useCallback(() => {
    const el = containerRef?.current;
    if (!el) return { maxX: 0, maxY: 0 };

    const rect = el.getBoundingClientRect();

    const maxX = (rect.width * (zoom - 1)) / 2;
    const maxY = (rect.height * (zoom - 1)) / 2;

    return { maxX, maxY };
  }, [containerRef, zoom]);

  const onMouseDown = useCallback(
    (e) => {
      if (!enabled) return;
      if (zoom <= 1) return;

      dragMovedRef.current = false;
      setIsDragging(true);

      dragStartRef.current = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      };
    },
    [enabled, zoom, offset]
  );

  const onMouseMove = useCallback(
    (e) => {
      if (!enabled) return;
      if (!isDragging) return;

      dragMovedRef.current = true;

      const { maxX, maxY } = getBounds();

      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;

      setOffset({
        x: clamp(newX, -maxX, maxX),
        y: clamp(newY, -maxY, maxY),
      });
    },
    [enabled, isDragging, getBounds]
  );

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => {
      dragMovedRef.current = false;
    }, 0);
  }, []);

  const hardReset = useMemo(
    () => ({
      setZoom: (fnOrValue) => {
        setZoom((z) => {
          const next =
            typeof fnOrValue === 'function' ? fnOrValue(z) : fnOrValue;
          return clamp(Number(next), ZOOM_MIN, ZOOM_MAX);
        });
      },
    }),
    []
  );

  return {
    zoom,
    offset,
    isDragging,
    dragMovedRef,
    onMouseDown,
    onMouseMove,
    stopDragging,
    resetZoom,
    hardReset,
    setOffset,
  };
};

export default useZoomDrag;