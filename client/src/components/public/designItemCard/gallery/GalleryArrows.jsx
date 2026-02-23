const GalleryArrows = ({ onPrev, onNext }) => {
  const btn =
    "absolute top-1/2 -translate-y-1/2 flex active:scale-95 opacity-0 group-hover:opacity-100";
  const icon = "h-8 w-8 text-amber-600";

  return (
    <>
      <button type="button" onClick={onPrev} className={`${btn} left-4`} aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="none" className={icon}>
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button type="button" onClick={onNext} className={`${btn} right-4`} aria-label="Next">
        <svg viewBox="0 0 24 24" fill="none" className={icon}>
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
};

export default GalleryArrows;