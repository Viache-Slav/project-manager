import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './publicDesignItems.module.css';

const PublicDesignItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    axios
      .get('/design-items/public/design-items')
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!items.length) {
    return <div>No products available</div>;
  }

  const addToOrder = (item) => {
    setOrderItems((prev) => {
      const existing = prev.find(
        (i) => i.designItemId === item._id
      );

      if (existing) {
        return prev.map((i) =>
          i.designItemId === item._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          designItemId: item._id,
          title: item.title,
          quantity: 1,
          options: {},
        },
      ];
    });
  };

  const submitOrder = async () => {
    if (!orderItems.length) {
      alert('Order is empty');
      return;
    }

    if (!customer.name || !customer.email || !customer.phone) {
      alert('Fill all contact fields');
      return;
    }

    try {
      await axios.post('/orders', {
        items: orderItems,
        customer,
      });

      alert('Order sent');

      setOrderItems([]);
      setCustomer({
        name: '',
        email: '',
        phone: '',
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to send order'
      );
    }
  };

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

          {item.dimensions && (
            <div className={styles.dimensions}>
              Size:
              {item.dimensions.width} × {item.dimensions.height}
              {item.dimensions.depth
                ? ` × ${item.dimensions.depth}`
                : ''} cm
            </div>
          )}

          {item.comment && (
            <div className={styles.description}>
              {item.comment}
            </div>
          )}

          <button
            className={styles.addButton}
            onClick={() => addToOrder(item)}
          >
            Add to order
          </button>

        </div>
      ))}

      {orderItems.length > 0 && (
        <div className={styles.orderInfo}>
          In order:{' '}
          {orderItems.reduce((sum, i) => sum + i.quantity, 0)} items
        </div>
      )}

      {orderItems.length > 0 && (
        <div className={styles.orderForm}>
          <h4>Contact details</h4>

          <input
            placeholder="Name"
            value={customer.name}
            onChange={(e) =>
              setCustomer({
                ...customer,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            value={customer.email}
            onChange={(e) =>
              setCustomer({
                ...customer,
                email: e.target.value,
              })
            }
          />

          <input
            placeholder="Phone"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({
                ...customer,
                phone: e.target.value,
              })
            }
          />

          <button
            className={styles.submitButton}
            onClick={submitOrder}
          >
            Place order
          </button>
        </div>
      )}

    </div>
  );
};

export default PublicDesignItems;
