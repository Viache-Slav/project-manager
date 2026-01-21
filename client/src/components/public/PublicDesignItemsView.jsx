import styles from './publicDesignItems.module.css';
import ClientRegisterForm from '../public/ClientRegisterForm';
import Modal from '../ui/Modal';

const PublicDesignItemsView = ({
  items,
  orderItems,
  isAuth,
  customer,
  showAuthModal,
  onAddToOrder,
  onSubmitOrder,
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

          <button
            className={styles.addButton}
            onClick={() => onAddToOrder(item)}
          >
            Add to order
          </button>
        </div>
      ))}

      {orderItems.length > 0 && (
        <div className={styles.orderInfo}>
          In order:{' '}
          {orderItems.reduce(
            (sum, i) => sum + i.quantity,
            0
          )}{' '}
          items
        </div>
      )}

      {orderItems.length > 0 && (
        <div className={styles.orderForm}>
          {!isAuth && (
            <button
              className={styles.submitButton}
              onClick={onOpenAuth}
            >
              Register to place order
            </button>
          )}

          {isAuth && (
            <>
              <h4>Contact details</h4>

              <div className={styles.customerInfo}>
                <div>
                  <strong>Name:</strong> {customer.name}
                </div>
                <div>
                  <strong>Email:</strong> {customer.email}
                </div>
                <div>
                  <strong>Phone:</strong> {customer.phone}
                </div>
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
