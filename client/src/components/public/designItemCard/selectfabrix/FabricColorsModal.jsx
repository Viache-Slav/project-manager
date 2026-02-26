import Modal from '../../../../components/ui/Modal';

const wrapperCls =
  'w-full max-w-[520px] px-4';

const titleCls =
  'mb-3 text-lg font-semibold text-white';

const gridCls =
  'grid grid-cols-3 gap-3 sm:grid-cols-4';

const cardBaseCls =
  'rounded-xl border-2 p-2 bg-white/5 shadow-sm transition-all hover:shadow-md';

const cardSelectedCls =
  'border-blue-400 shadow-md';

const cardDefaultBorder =
  'border-transparent';

const imageCls =
  'aspect-square w-full rounded-lg object-cover';

const emptyImageCls =
  'aspect-square w-full rounded-lg bg-white/10';

const colorNameCls =
  'mt-2 text-center text-sm text-white/85';

const closeBtnCls =
  'mt-4 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white shadow-sm hover:bg-white/10 hover:shadow-md transition-all';

const FabricColorsModal = ({
  open,
  title,
  colors,
  selectedColor,
  onClose,
  onPick,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={wrapperCls}>
        <div className={titleCls}>{title}</div>

        {colors?.length > 0 ? (
          <div className={gridCls}>
            {colors.map((c) => {
              const imgId = c.images?.[0];
              const isSelected = selectedColor === c.colorName;

              return (
                <button
                  key={c._id}
                  type="button"
                  className={`${cardBaseCls} ${
                    isSelected ? cardSelectedCls : cardDefaultBorder
                  }`}
                  onClick={() => onPick(c)}
                >
                  {imgId ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/files/${imgId}`}
                      alt={c.colorName}
                      className={imageCls}
                      draggable="false"
                    />
                  ) : (
                    <div className={emptyImageCls} />
                  )}

                  <div className={colorNameCls}>
                    {c.colorName}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-white/70">
            No colors for this collection
          </div>
        )}

        <button
          type="button"
          className={closeBtnCls}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default FabricColorsModal;