import { useEffect, useRef } from 'react';

const useGalleryIndex = ({ open, trackRef, activeIndex, setActiveIndex }) => {
  const tRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!open) return;

    const el = trackRef.current;
    if (!el) return;

    const commit = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      if (Number.isNaN(idx)) return;

      setActiveIndex((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (tRef.current) clearTimeout(tRef.current);

        tRef.current = setTimeout(commit, 90);
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      el.removeEventListener('scroll', onScroll);
      if (tRef.current) clearTimeout(tRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, trackRef, setActiveIndex]);

  useEffect(() => {
    if (!open) return;

    const el = trackRef.current;
    if (!el) return;

    const onResize = () => {
      el.scrollTo({ left: el.clientWidth * activeIndex, behavior: 'auto' });
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, trackRef, activeIndex]);
};

export default useGalleryIndex;