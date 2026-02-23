import { useCallback, useMemo, useState } from 'react';
import PublicDesignItemCardView from './PublicDesignItemCardView';
import GalleryModal from './gallery/GalleryModal';

const PublicDesignItemCard = ({
  item,
  selected,
  colors,
  onSelectFabric,
  onSelectColor,
  onAddToOrder,
}) => {
  const images = useMemo(() => item.images || [], [item.images]);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openGallery = useCallback((index = 0) => {
    setActiveIndex(index);
    setGalleryOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    setGalleryOpen(false);
  }, []);

  return (
    <>
      <PublicDesignItemCardView
        item={item}
        images={images}
        selected={selected}
        colors={colors}
        onSelectFabric={onSelectFabric}
        onSelectColor={onSelectColor}
        onAddToOrder={onAddToOrder}
        onOpenGallery={openGallery}
      />

      <GalleryModal
        open={galleryOpen}
        onClose={closeGallery}
        images={images}
        title={item.title}
        comment={item.comment}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </>
  );
};

export default PublicDesignItemCard;