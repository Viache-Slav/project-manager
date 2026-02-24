import { useRef } from 'react';
import Modal from '../../../ui/Modal';

import GallerySidePreviews from './GallerySidePreviews';
import GalleryClickZones from './GalleryClickZones';
import GalleryArrows from './GalleryArrows';
import GalleryCounter from './GalleryCounter';
import GalleryHint from './GalleryHint';
import GalleryViewport from './GalleryViewport';

import useFullscreen from '../hooks/useFullscreen';
import useZoomDrag from '../hooks/useZoomDrag';
import useGalleryIndex from '../hooks/useGalleryIndex';
import useGalleryKeyboard from '../hooks/useGalleryKeyboard';
import useGalleryNavigation from '../hooks/useGalleryNavigation';
import useResetZoomOnOpen from '../hooks/useResetZoomOnOpen';

const GalleryModal = ({
  open,
  onClose,
  images,
  title,
  comment,
  activeIndex,
  setActiveIndex,
}) => {
  const trackRef = useRef(null);
  const fsRef = useRef(null);
  const frameRef = useRef(null);

  const { isFs, toggleFullscreen, exitFullscreen } = useFullscreen(fsRef);

  const {
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
  } = useZoomDrag({
    enabled: open,
    containerRef: frameRef,
  });

  const { hasMany, prevIndex, nextIndex, goTo, prev, next } = useGalleryNavigation({
    images,
    activeIndex,
    setActiveIndex,
    trackRef,
    duration: 300,
  });

  useGalleryIndex({ open, trackRef, activeIndex, setActiveIndex });

  useGalleryKeyboard({
    open,
    prev,
    next,
    onEsc: () => {
      if (document.fullscreenElement) exitFullscreen();
      else onClose();
    },
  });

  useResetZoomOnOpen({ open, activeIndex, resetZoom });

  const containerCls = 'mx-auto w-full max-w-[1200px] px-4 lg:px-8 pb-6 box-border';

  const galleryWrapperCls =
    'group relative overflow-hidden rounded-2xl border border-white/10 bg-black/70 shadow-2xl backdrop-blur p-2 sm:p-3';

  const overlayCls = 'pointer-events-none absolute inset-0 bg-black/25';

  const leftGradientCls =
    'pointer-events-none absolute inset-y-0 left-0 w-14 sm:w-24 bg-gradient-to-r from-black/80 to-transparent';

  const rightGradientCls =
    'pointer-events-none absolute inset-y-0 right-0 w-14 sm:w-24 bg-gradient-to-l from-black/80 to-transparent';

  const commentCls = 'mt-3 rounded-2xl bg-black/50 p-4 text-sm text-white/85 backdrop-blur';

  return (
    <Modal open={open} onClose={onClose}>
      <div className={containerCls}>
        <div className={galleryWrapperCls}>
          <GallerySidePreviews
            images={images}
            prevIndex={prevIndex}
            nextIndex={nextIndex}
            isFs={isFs}
          />

          <div className={overlayCls} />
          <div className={leftGradientCls} />
          <div className={rightGradientCls} />

          <GalleryViewport
            images={images}
            title={title}
            isFs={isFs}
            fsRef={fsRef}
            trackRef={trackRef}
            frameRef={frameRef}
            activeIndex={activeIndex}
            goTo={goTo}
            zoom={zoom}
            offset={offset}
            isDragging={isDragging}
            dragMovedRef={dragMovedRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            stopDragging={stopDragging}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            resetZoom={resetZoom}
            toggleFullscreen={toggleFullscreen}
            wheelEnabled={open}
            setZoom={hardReset.setZoom}
            setOffset={setOffset}
          />

          {hasMany && (
            <>
              <GalleryClickZones onPrev={prev} onNext={next} />
              <GalleryArrows onPrev={prev} onNext={next} />
            </>
          )}

          <GalleryCounter activeIndex={activeIndex} total={images.length} />

          {!isFs && <GalleryHint />}
        </div>

        {comment && <div className={commentCls}>{comment}</div>}
      </div>
    </Modal>
  );
};

export default GalleryModal;