import { useCallback, useMemo } from 'react';
import { animateScrollToIndex } from './scrollToIndex';

const useGalleryNavigation = ({
  images,
  activeIndex,
  setActiveIndex,
  trackRef,
  duration = 300,
}) => {
  const hasMany = images.length > 1;

  const prevIndex = useMemo(
    () => (images.length ? (activeIndex - 1 + images.length) % images.length : 0),
    [activeIndex, images.length]
  );

  const nextIndex = useMemo(
    () => (images.length ? (activeIndex + 1) % images.length : 0),
    [activeIndex, images.length]
  );

  const goTo = useCallback(
    (idx) => {
      if (!images.length) return;

      const nextIdx = (idx + images.length) % images.length;
      setActiveIndex(nextIdx);

      const el = trackRef.current;
      if (!el) return;

      animateScrollToIndex(el, nextIdx, duration);
    },
    [images.length, setActiveIndex, trackRef, duration]
  );

  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);
  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);

  return { hasMany, prevIndex, nextIndex, goTo, prev, next };
};

export default useGalleryNavigation;