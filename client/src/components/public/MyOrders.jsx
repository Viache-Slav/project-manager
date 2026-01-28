import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './myOrders.module.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/orders/my');
        setOrders(res.data);
      } catch (e) {
        console.error('LOAD MY ORDERS ERROR', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  if (!orders.length)
    return <div className={styles.empty}>You have no orders yet</div>;

  return (
    <section className={styles.wrapper}>
      <h3>My orders</h3>

      {orders.map((order) => (
        <div key={order._id} className={styles.card}>
          <div className={styles.header}>
            <span>#{order._id.slice(-6)}</span>
            <span>
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div>Status: {order.status}</div>
          <div>Total: {order.totalPrice} zł</div>

          <div className={styles.items}>
            {order.items.map((item, idx) => (
              <div key={idx} className={styles.item}>
                {/* PRODUCT IMAGE */}
                {item.productImage && (
                  <img
                    className={styles.productImage}
                    src={`${import.meta.env.VITE_API_URL}/files/${item.productImage}`}
                    alt={item.title}
                  />
                )}

                <div className={styles.content}>
                  <div className={styles.title}>{item.title}</div>

                  {/* FABRIC */}
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
                    <span>Total: {item.finalPrice} zł</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default MyOrders;
