const GalleryClickZones = ({ onPrev, onNext }) => {
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-0 top-0 h-full w-[18%] cursor-pointer"
        aria-label="Previous image"
        title="Previous"
      />

      <button
        type="button"
        onClick={onNext}
        className="absolute right-0 top-0 h-full w-[18%] cursor-pointer"
        aria-label="Next image"
        title="Next"
      />
    </>
  );
};

export default GalleryClickZones;