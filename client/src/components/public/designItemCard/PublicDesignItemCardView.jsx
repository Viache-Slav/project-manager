const PublicDesignItemCardView = ({
  item,
  images,
  selected,
  colors,
  onSelectFabric,
  onSelectColor,
  onAddToOrder,
  onOpenGallery,
}) => {
  return (
    <div className="rounded-xl border border-gray-500/10 bg-gray-500/70 p-4 backdrop-blur">
      {images[0] && (
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

      <div className="text-sm text-white/70">{item.type?.name}</div>
      <div className="font-semibold">{item.title}</div>

      <div className="mt-2 text-sm text-white/70">
        Price:{' '}
        <span className="font-semibold">{item.salePrice} zł</span>
      </div>

      {item.fabricOptions?.length > 0 && (
        <select
          className="mt-3 w-full cursor-pointer rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
          value={selected?.collection || ''}
          onChange={(e) => onSelectFabric(item._id, e.target.value)}
        >
          <option value="">Select collection</option>

          {item.fabricOptions.map((f, i) => (
            <option key={i} value={`${f.brand}||${f.collectionName}`}>
              {f.brand} / {f.collectionName}
            </option>
          ))}
        </select>
      )}

      {colors?.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {colors.map((c) => {
            const imgId = c.images?.[0];
            const isSelected = selected?.color === c.colorName;

            return (
              <button
                type="button"
                key={c._id}
                className={[
                  'overflow-hidden rounded-lg border-2 bg-white/5 text-left',
                  isSelected ? 'border-blue-400' : 'border-transparent',
                ].join(' ')}
                onClick={() =>
                  onSelectColor(item._id, c.colorName, imgId || null)
                }
              >
                {imgId ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/files/${imgId}`}
                    alt={c.colorName}
                    className="h-[70px] w-full object-cover"
                    draggable="false"
                  />
                ) : (
                  <div className="h-[70px] w-full bg-white/5" />
                )}

                <div className="px-2 py-1 text-center text-[12px] text-white/85">
                  {c.colorName}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <button
        className="mt-4 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
        onClick={() => onAddToOrder(item)}
      >
        Add to order
      </button>
    </div>
  );
};

export default PublicDesignItemCardView;