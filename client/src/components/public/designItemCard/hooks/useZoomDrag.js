import { useCallback, useMemo, useRef, useState } from 'react';

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

const useZoomDrag = ({ enabled, containerRef }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);

  const pointersRef = useRef(new Map());
  const pinchRef = useRef({
    active: false,
    startDist: 0,
    startZoom: 1,
    startOffset: { x: 0, y: 0 },
    center: { x: 0, y: 0 },
  });

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

  const startDrag = useCallback(
    (clientX, clientY) => {
      if (!enabled) return;
      if (zoom <= 1) return;

      dragMovedRef.current = false;
      setIsDragging(true);

      dragStartRef.current = {
        x: clientX - offset.x,
        y: clientY - offset.y,
      };
    },
    [enabled, zoom, offset]
  );

  const moveDrag = useCallback(
    (clientX, clientY) => {
      if (!enabled) return;
      if (!isDragging) return;

      dragMovedRef.current = true;

      const { maxX, maxY } = getBounds();

      const newX = clientX - dragStartRef.current.x;
      const newY = clientY - dragStartRef.current.y;

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

  const onMouseDown = useCallback(
    (e) => startDrag(e.clientX, e.clientY),
    [startDrag]
  );

  const onMouseMove = useCallback(
    (e) => moveDrag(e.clientX, e.clientY),
    [moveDrag]
  );

  const onPointerDown = useCallback(
    (e) => {
      if (!enabled) return;

      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const pts = [...pointersRef.current.values()];

      // 1 палец + zoom=1 -> отдаём жест треку (листать)
      if (pts.length === 1 && zoom <= 1) return;

      // pinch или drag при zoom>1 -> перехватываем pointer
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } catch {}

      if (pts.length === 1) {
        startDrag(e.clientX, e.clientY);
        return;
      }

      if (pts.length === 2) {
        const el = containerRef?.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const p0 = pts[0];
        const p1 = pts[1];

        pinchRef.current.active = true;
        pinchRef.current.startDist = dist(p0, p1);
        pinchRef.current.startZoom = zoom;
        pinchRef.current.startOffset = offset;

        const center = mid(p0, p1);

        pinchRef.current.center = {
          x: center.x - rect.left - rect.width / 2,
          y: center.y - rect.top - rect.height / 2,
        };

        setIsDragging(false);
        dragMovedRef.current = true;
      }
    },
    [enabled, zoom, containerRef, startDrag, offset]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!enabled) return;
      if (!pointersRef.current.has(e.pointerId)) return;

      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const pts = [...pointersRef.current.values()];

      if (pinchRef.current.active && pts.length >= 2) {
        const p0 = pts[0];
        const p1 = pts[1];

        const d = dist(p0, p1);
        const startD = pinchRef.current.startDist;
        if (!startD) return;

        const ratio = d / startD;

        const nextZoom = clamp(
          Number((pinchRef.current.startZoom * ratio).toFixed(2)),
          ZOOM_MIN,
          ZOOM_MAX
        );

        const zoomRatio = nextZoom / pinchRef.current.startZoom;
        const c = pinchRef.current.center;

        const { maxX, maxY } = getBounds();

        const nextOffset = {
          x: pinchRef.current.startOffset.x - c.x * (zoomRatio - 1),
          y: pinchRef.current.startOffset.y - c.y * (zoomRatio - 1),
        };

        setZoom(nextZoom);
        setOffset({
          x: clamp(nextOffset.x, -maxX, maxX),
          y: clamp(nextOffset.y, -maxY, maxY),
        });

        return;
      }

      if (pts.length === 1) {
        moveDrag(e.clientX, e.clientY);
      }
    },
    [enabled, moveDrag, getBounds]
  );

  const onPointerUp = useCallback(
    (e) => {
      pointersRef.current.delete(e.pointerId);

      const pts = [...pointersRef.current.values()];

      if (pts.length < 2) pinchRef.current.active = false;

      if (pts.length === 1) {
        const p0 = pts[0];
        startDrag(p0.x, p0.y);
      } else {
        stopDragging();
      }
    },
    [startDrag, stopDragging]
  );

  const hardReset = useMemo(
    () => ({
      setZoom: (fnOrValue) => {
        setZoom((z) => {
          const next = typeof fnOrValue === 'function' ? fnOrValue(z) : fnOrValue;
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

    onPointerDown,
    onPointerMove,
    onPointerUp,

    resetZoom,
    hardReset,
    setOffset,
  };
};

export default useZoomDrag;