const GallerySidePreviews = ({
  images,
  prevIndex,
  nextIndex,
  isFs,
}) => {
  if (images.length <= 1) return null;

  const prev = images[prevIndex];
  const next = images[nextIndex];

  const baseCls =
    "pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-xl object-cover transition-all duration-300";

  const sizeCls =
    "h-[65%] w-[32%] sm:h-[70%] sm:w-[30%]";

  const visualCls = [
    "scale-[0.92]",
    isFs ? "opacity-25" : "opacity-50",
    "blur-sm",
    "shadow-[0_25px_60px_rgba(0,0,0,0.55)]",
    "border border-white/10",
  ].join(" ");

  return (
    <>
      {prev && (
        <img
          src={`${import.meta.env.VITE_API_URL}/files/${prev}`}
          alt=""
          className={`${baseCls} ${sizeCls} ${visualCls} left-4`}
          draggable="false"
        />
      )}

      {next && (
        <img
          src={`${import.meta.env.VITE_API_URL}/files/${next}`}
          alt=""
          className={`${baseCls} ${sizeCls} ${visualCls} right-4`}
          draggable="false"
        />
      )}
    </>
  );
};

export default GallerySidePreviews;