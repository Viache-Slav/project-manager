const money = (v) => `${Number(v || 0).toFixed(2)} zł`;

const PublicCart = ({
  orderItems,
  totalPrice,
  onIncreaseQty,
  onDecreaseQty,
  onRemoveItem,
  isAuth,
  customer,
  onOpenAuth,
  onSubmitOrder,
}) => {
  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <h4 className="text-base font-semibold">Order</h4>

      <div className="mt-4 grid gap-4">
        {orderItems.map((item, index) => (
          <div
            key={index}
            className="grid gap-4 rounded-xl border border-white/10 bg-black/10 p-3 sm:grid-cols-[120px_1fr]"
          >
            {item.productImageId ? (
              <img
                className="h-[100px] w-full rounded-lg object-cover"
                src={`${import.meta.env.VITE_API_URL}/files/${item.productImageId}`}
                alt={item.title}
              />
            ) : (
              <div className="h-[100px] w-full rounded-lg bg-white/5" />
            )}

            <div className="flex flex-col gap-2">
              <div className="font-semibold">{item.title}</div>

              <div className="text-sm text-white/80">
                <span className="font-semibold">Fabric:</span>{' '}
                {item.options.fabric.brand} / {item.options.fabric.collectionName} /{' '}
                {item.options.fabric.color}
              </div>

              {item.options.fabric.imageId && (
                <img
                  className="h-[60px] w-[80px] rounded-md object-cover"
                  src={`${import.meta.env.VITE_API_URL}/files/${item.options.fabric.imageId}`}
                  alt={item.options.fabric.color}
                />
              )}

              <div className="flex items-center gap-3">
                <button
                  className="h-7 w-7 rounded-md bg-white/10 text-white hover:bg-white/20"
                  onClick={() => onDecreaseQty(index)}
                >
                  −
                </button>

                <span className="min-w-6 text-center">{item.quantity}</span>

                <button
                  className="h-7 w-7 rounded-md bg-white/10 text-white hover:bg-white/20"
                  onClick={() => onIncreaseQty(index)}
                >
                  +
                </button>

                <button
                  className="ml-auto text-lg text-white/60 hover:text-red-400"
                  onClick={() => onRemoveItem(index)}
                  aria-label="Remove item"
                  title="Remove"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm text-white/85">{money(item.subtotal)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        <div className="flex items-baseline justify-end gap-2 text-lg">
          <span className="text-white/80">Total:</span>
          <span className="font-semibold">{money(totalPrice)}</span>
        </div>

        {!isAuth ? (
          <button
            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            onClick={onOpenAuth}
          >
            Register to place order
          </button>
        ) : (
          <>
            <div className="grid gap-1 text-sm text-white/80">
              <div>{customer.name}</div>
              <div>{customer.email}</div>
              <div>{customer.phone}</div>
            </div>

            <button
              className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              onClick={onSubmitOrder}
            >
              Place order
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicCart;