import styles from './AdminOrders.module.css';

const AdminOrdersView = ({ loading, orders, onStatusChange }) => {
  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (!orders.length) {
    return <p>No orders found</p>;
  }

  return (
    <div className={styles.wrapper}>
      <h2>Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className={styles.orderCard}>
          <div className={styles.header}>
            <strong>Order ID:</strong> {order._id}
          </div>

          <div>
            <strong>Status:</strong>{' '}
            <select
              value={order.status}
              onChange={(e) =>
                onStatusChange(order._id, e.target.value)
              }
            >
              <option value="new">new</option>
              <option value="confirmed">confirmed</option>
              <option value="in_work">in_work</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          <div>
            <strong>Total:</strong> {order.totalPrice} zł
          </div>

          <div>
            <strong>Customer:</strong>
            <div>Name: {order.customer.name}</div>
            <div>Email: {order.customer.email}</div>
            <div>Phone: {order.customer.phone}</div>
          </div>

          <div className={styles.items}>
            <strong>Items:</strong>

            {order.items.map((item, index) => (
              <div key={index} className={styles.item}>
                {item.productImage && (
                  <img
                    className={styles.productImage}
                    src={`${import.meta.env.VITE_API_URL}/files/${item.productImage}`}
                    alt={item.title}
                  />
                )}

                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{item.title}</div>

                  {item.fabric && (
                    <div className={styles.fabric}>
                      <div>
                        Fabric:
                        <strong>
                          {' '}
                          {item.fabric.brand} / {item.fabric.collection}
                        </strong>
                      </div>

                      <div>Color: {item.fabric.color}</div>

                      {item.fabric.code && (
                        <div>Code: {item.fabric.code}</div>
                      )}

                      {item.fabric.image && (
                        <img
                          className={styles.fabricImage}
                          src={`${import.meta.env.VITE_API_URL}/files/${item.fabric.image}`}
                          alt="fabric"
                        />
                      )}
                    </div>
                  )}

                  <div className={styles.meta}>
                    <span>Qty: {item.quantity}</span>
                    <span>Item total: {item.finalPrice} zł</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.date}>
            Created:{' '}
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersView;
