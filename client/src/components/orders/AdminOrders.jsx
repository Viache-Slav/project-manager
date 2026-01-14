import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './AdminOrders.module.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/orders')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading orders...</p>;

  if (!orders.length) {
    return <p>No orders found</p>;
  }

  return (
    <div className={styles.wrapper}>
      <h2>Orders</h2>

      {orders.map(order => (
        <div key={order._id} className={styles.orderCard}>
          <div className={styles.header}>
            <strong>Order ID:</strong> {order._id}
          </div>

          <div>
            <strong>Status:</strong> {order.status}
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
                <div>{item.title}</div>
                <div>Qty: {item.quantity}</div>
                <div>Price: {item.finalPrice} zł</div>
              </div>
            ))}
          </div>

          <div className={styles.date}>
            Created: {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
