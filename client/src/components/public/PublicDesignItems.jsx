import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './publicDesignItems.module.css';

import ClientRegisterForm from '../public/ClientRegisterForm';
import Modal from '../ui/Modal';

const PublicDesignItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isAuth = Boolean(localStorage.getItem('token'));

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

  useEffect(() => {
    if (!isAuth) return;

    axios
      .get('/auth/me')
      .then((res) => {
        const user = res.data;
        setCustomer({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        });
      })
      .catch(() => {});
  }, [isAuth]);

  if (loading) return <div>Loading...</div>;
  if (!items.length) return <div>No products available</div>;

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

    if (!isAuth) {
      setShowAuthModal(true);
      return;
    }

    try {
      await axios.post('/orders', {
        items: orderItems,
        customer,
      });

      alert('Order sent');
      setOrderItems([]);
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
          {!isAuth && (
            <button
              className={styles.submitButton}
              onClick={() => setShowAuthModal(true)}
            >
              Register to place order
            </button>
          )}

          {isAuth && (
            <>
              <h4>Contact details</h4>

              <div className={styles.customerInfo}>
                <div><strong>Name:</strong> {customer.name}</div>
                <div><strong>Email:</strong> {customer.email}</div>
                <div><strong>Phone:</strong> {customer.phone}</div>
              </div>

              <button
                className={styles.submitButton}
                onClick={submitOrder}
              >
                Place order
              </button>
            </>
          )}
        </div>
      )}

      <Modal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      >
        <ClientRegisterForm
          onSuccess={() => setShowAuthModal(false)}
        />
      </Modal>
    </div>
  );
};

export default PublicDesignItems;
