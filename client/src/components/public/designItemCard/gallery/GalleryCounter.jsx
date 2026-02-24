const GalleryCounter = ({ activeIndex, total }) => {
  if (!total) return null;

  return (
    <div className="pointer-events-none absolute bottom-3 right-1 rounded-full bg-black/30 px-2 py-1 text-xs text-white/70">
      {activeIndex + 1} / {total}
    </div>
  );
};

export default GalleryCounter;