import useWheelZoom from '../hooks/useWheelZoom';

const GalleryViewport = ({
  images,
  title,
  isFs,
  fsRef,
  trackRef,
  activeIndex,
  goTo,
  zoom,
  offset,
  isDragging,
  dragMovedRef,
  onMouseDown,
  onMouseMove,
  stopDragging,
  resetZoom,
  toggleFullscreen,
  wheelEnabled,
  setZoom,
  setOffset,
}) => {
  useWheelZoom({
  enabled: wheelEnabled,
  isFs,
  trackRef,
  zoom,
  setZoom,
  setOffset,
});

const rootCls = [
    'gallery-fs relative mx-auto w-full',
    isFs ? 'max-w-none' : 'max-w-none sm:max-w-[980px]',
  ].join(' ');

  const trackCls = [
    'no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain',
    'scroll-smooth [scroll-behavior:smooth]',
    isFs ? 'h-[100vh]' : '',
  ].join(' ');

  const frameCls = [
    'flex w-full items-center justify-center',
    isFs
      ? 'h-[100vh]'
      : 'h-[60vh] sm:h-[68vh] min-h-[240px] sm:min-h-[360px] max-h-[70vh]',
  ].join(' ');

  const imgCls = [
    'select-none object-contain transition-transform duration-100',
    isFs ? 'h-[100vh] w-[100vw]' : 'h-full w-full',
  ].join(' ');

  const activeStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
    transformOrigin: 'center center',
    cursor:
      zoom > 1
        ? isDragging
          ? 'grabbing'
          : 'grab'
        : 'zoom-in',
  };

  return (
    <div ref={fsRef} className={rootCls}>
      <div ref={trackRef} className={trackCls}>
        {images.map((id, idx) => (
          <div
            key={id}
            className="w-full flex-[0_0_100%] snap-center [scroll-snap-stop:always]"
          >
            <div className={frameCls}>
              <img
                src={`${import.meta.env.VITE_API_URL}/files/${id}`}
                alt={`${title} ${idx + 1}`}
                className={imgCls}
                style={idx === activeIndex ? activeStyle : undefined}
                draggable="false"
                onMouseDown={(e) => idx === activeIndex && onMouseDown(e)}
                onMouseMove={(e) => idx === activeIndex && onMouseMove(e)}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onClick={() => {
                  if (dragMovedRef.current) return;

                  if (idx !== activeIndex) {
                    goTo(idx);
                    return;
                  }

                  if (zoom > 1) {
                    resetZoom();
                    return;
                  }

                  toggleFullscreen();
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryViewport;