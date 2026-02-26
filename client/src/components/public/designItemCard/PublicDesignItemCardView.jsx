import CollectionDropdown from './selectfabrix/CollectionDropdown';
import FabricColorsModal from './selectfabrix/FabricColorsModal';

const PublicDesignItemCardView = ({
  item,
  images,
  selected,
  colors,

  selectedLabel,
  options,

  isFabricModalOpen,
  onPickCollection,
  onCloseFabricModal,
  onPickColor,

  onAddToOrder,
  onOpenGallery,
}) => {
  return (
    <div className="rounded-xl border border-gray-500/10 bg-gray-500/70 p-4 backdrop-blur">
      {images?.[0] && (
        <button
          type="button"
          className="block w-full"
          onClick={() => onOpenGallery(0)}
          aria-label="Open product gallery"
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/files/${images[0]}`}
            alt={item.title}
            className="mb-3 h-[180px] w-full rounded-lg object-cover"
            draggable="false"
          />
        </button>
      )}

      <div className="text-sm text-white/70">{item.type?.name} :</div>
      <div className="font-semibold">{item.title}</div>

      <div className="mt-2 text-sm text-white/70">
        Price: <span className="font-semibold">{item.salePrice} zł</span>
      </div>

      {options?.length > 0 && (
        <CollectionDropdown
          className="mt-3"
          options={options}
          selectedValue={selected?.collection || ''}
          selectedLabel={selectedLabel}
          onPick={onPickCollection}
        />
      )}

      <FabricColorsModal
        open={isFabricModalOpen}
        title={selectedLabel}
        colors={colors}
        selectedColor={selected?.color || ''}
        onClose={onCloseFabricModal}
        onPick={onPickColor}
      />

      <button
        className="mt-4 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm shadow-sm text-white hover:shadow-md hover:bg-white/10 transition-all"
        onClick={onAddToOrder}
      >
        Add to order
      </button>
    </div>
  );
};

export default PublicDesignItemCardView;