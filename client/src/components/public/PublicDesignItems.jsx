import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import PublicDesignItemsView from './PublicDesignItemsView';

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
  if (!items.length)
    return <div>No products available</div>;

  const addToOrder = (item) => {
    setOrderItems((prev) => {
      const existing = prev.find(
        (i) => i.designItemId === item._id
      );

      if (existing) {
        return prev.map((i) =>
          i.designItemId === item._id
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
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
    <PublicDesignItemsView
      items={items}
      orderItems={orderItems}
      isAuth={isAuth}
      customer={customer}
      showAuthModal={showAuthModal}
      onAddToOrder={addToOrder}
      onSubmitOrder={submitOrder}
      onOpenAuth={() => setShowAuthModal(true)}
      onCloseAuth={() => setShowAuthModal(false)}
    />
  );
};

export default PublicDesignItems;
