import styles from './publicDesignItems.module.css';
import ClientRegisterForm from '../public/ClientRegisterForm';
import Modal from '../ui/Modal';

const PublicDesignItemsView = ({
  items,
  orderItems,
  totalPrice,
  onRemoveItem,
  selectedFabrics,
  fabricColors,
  onSelectFabric,
  onSelectColor,
  isAuth,
  customer,
  showAuthModal,
  onAddToOrder,
  onSubmitOrder,
  onIncreaseQty,
  onDecreaseQty,
  onOpenAuth,
  onCloseAuth,
}) => {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item._id} className={styles.card}>
          {item.images?.[0] && (
            <img
              src={`${import.meta.env.VITE_API_URL}/files/${item.images[0]}`}
              alt={item.title}
              className={styles.image}
            />
          )}

          <div className={styles.title}>{item.title}</div>
          <div className={styles.type}>{item.type?.name}</div>

          <div className={styles.price}>
            Price: <strong>{item.salePrice} zł</strong>
          </div>

          {item.fabricOptions?.length > 0 && (
            <select
              className={styles.fabricSelect}
              value={selectedFabrics[item._id]?.collection || ''}
              onChange={(e) =>
                onSelectFabric(item._id, e.target.value)
              }
            >
              <option value="">Select collection</option>

              {item.fabricOptions.map((f, i) => (
                <option
                  key={i}
                  value={`${f.brand}||${f.collectionName}`}
                >
                  {f.brand} / {f.collectionName}
                </option>
              ))}
            </select>
          )}

          {fabricColors[item._id]?.length > 0 && (
            <div className={styles.colorsGrid}>
              {fabricColors[item._id].map((c) => {
                const imgId = c.images?.[0];
                const selected =
                  selectedFabrics[item._id]?.color === c.colorName;

                return (
                  <div
                    key={c._id}
                    className={`${styles.colorItem} ${
                      selected ? styles.selected : ''
                    }`}
                    onClick={() =>
                      onSelectColor(
                        item._id,
                        c.colorName,
                        c.images?.[0] || null
                      )
                    }
                  >
                    {imgId && (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/files/${imgId}`}
                        alt={c.colorName}
                      />
                    )}

                    <div className={styles.colorLabel}>
                      {c.colorName}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            className={styles.addButton}
            onClick={() => onAddToOrder(item)}
          >
            Add to order
          </button>
        </div>
      ))}

      {orderItems.length > 0 && (
        <div className={styles.cart}>
          <h4>Order</h4>

          {orderItems.map((item, index) => (
            <div key={index} className={styles.cartItem}>
              {item.productImageId && (
                <img
                  className={styles.cartProductImage}
                  src={`${import.meta.env.VITE_API_URL}/files/${item.productImageId}`}
                  alt={item.title}
                />
              )}

              <div className={styles.cartDetails}>
                <div className={styles.cartTitle}>{item.title}</div>

                <div className={styles.cartFabric}>
                  <strong>Fabric:</strong>{' '}
                  {item.options.fabric.brand} / 
                  {item.options.fabric.collectionName} / 
                  {item.options.fabric.color}
                </div>

                {item.options.fabric.imageId && (
                  <img
                    className={styles.cartFabricImage}
                    src={`${import.meta.env.VITE_API_URL}/files/${item.options.fabric.imageId}`}
                    alt={item.options.fabric.color}
                  />
                )}

                <div className={styles.cartQty}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => onDecreaseQty(index)}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    className={styles.qtyBtn}
                    onClick={() => onIncreaseQty(index)}
                  >
                    +
                  </button>
                </div>

                <div className={styles.cartSubtotal}>
                  {item.subtotal.toFixed(2)} zł
                </div>
                
                <button
                  className={styles.removeBtn}
                  onClick={() => onRemoveItem(index)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className={styles.cartFooter}>
            <div className={styles.cartTotal}>
              <span>Total:</span>
              <strong>{totalPrice.toFixed(2)} zł</strong>
            </div>

            {!isAuth ? (
              <button
                className={styles.submitButton}
                onClick={onOpenAuth}
              >
                Register to place order
              </button>
            ) : (
              <>
                <div className={styles.customerInfo}>
                  <div>{customer.name}</div>
                  <div>{customer.email}</div>
                  <div>{customer.phone}</div>
                </div>

                <button
                  className={styles.submitButton}
                  onClick={onSubmitOrder}
                >
                  Place order
                </button>
              </>
            )}
          </div>
        </div>
      )}

      

      <Modal open={showAuthModal} onClose={onCloseAuth}>
        <ClientRegisterForm
          onSuccess={onCloseAuth}
        />
      </Modal>
    </div>
  );
};

export default PublicDesignItemsView;
