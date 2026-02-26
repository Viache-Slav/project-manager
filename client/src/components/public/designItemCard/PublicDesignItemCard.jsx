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

  const [isFabricModalOpen, setIsFabricModalOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const collectionLabel = selected?.collection
      ? selected.collection.split('||').join(' / ')
      : '';

    const colorLabel = selected?.color ? ` — ${selected.color}` : '';

    return collectionLabel
      ? `${collectionLabel}${colorLabel}`
      : 'Select collection';
  }, [selected?.collection, selected?.color]);

  const fabricOptions = useMemo(() => {
    const arr = item.fabricOptions ?? [];
    return arr
      .map((f) => ({
        value: `${f.brand}||${f.collectionName}`,
        label: `${f.brand} / ${f.collectionName}`,
      }))
      .filter((o) => o.value && o.label);
  }, [item.fabricOptions]);

  const openGallery = useCallback((index = 0) => {
    setActiveIndex(index);
    setGalleryOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    setGalleryOpen(false);
  }, []);

  const openFabricModalFor = useCallback(
    (value) => {
      onSelectFabric(item._id, value);
      setIsFabricModalOpen(true);
    },
    [item._id, onSelectFabric]
  );

  const closeFabricModal = useCallback(() => {
    setIsFabricModalOpen(false);
  }, []);

  const pickColor = useCallback(
    (c) => {
      const imgId = c.images?.[0] || null;
      onSelectColor(item._id, c.colorName, imgId);
      setIsFabricModalOpen(false);
    },
    [item._id, onSelectColor]
  );

  const addToOrder = useCallback(() => {
    onAddToOrder(item);
  }, [item, onAddToOrder]);

  return (
    <>
      <PublicDesignItemCardView
        item={item}
        images={images}
        selected={selected}
        colors={colors}
        selectedLabel={selectedLabel}
        options={fabricOptions}
        isFabricModalOpen={isFabricModalOpen}
        onPickCollection={openFabricModalFor}
        onCloseFabricModal={closeFabricModal}
        onPickColor={pickColor}
        onAddToOrder={addToOrder}
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