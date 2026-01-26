import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import PublicDesignItemsView from './PublicDesignItemsView';

const PublicDesignItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isAuth = Boolean(localStorage.getItem('token'));
  const [selectedFabrics, setSelectedFabrics] = useState({});
  const [fabricColors, setFabricColors] = useState({});

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

  const selectFabric = (itemId, value) => {
    setSelectedFabrics((prev) => ({
      ...prev,
      [itemId]: {
        collection: value,
        color: '',
      },
    }));

    const [brand, collectionName] = value.split('||');
    loadColors(itemId, brand, collectionName);
  };

  const loadColors = async (itemId, brand, collectionName) => {
    try {
      const res = await axios.get('/fabrics/colors', {
        params: { brand, collectionName },
      });

      setFabricColors((prev) => ({
        ...prev,
        [itemId]: res.data,
      }));
    } catch {
      setFabricColors((prev) => ({
        ...prev,
        [itemId]: [],
      }));
    }
  };

  const selectColor = (itemId, color) => {
    setSelectedFabrics((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        color,
      },
    }));
  };

  const addToOrder = (item) => {
    const selected = selectedFabrics[item._id];

    if (!selected?.collection || !selected?.color) {
      alert('Select fabric and color');
      return;
    }

    const [brand, collectionName] = selected.collection.split('||');

    setOrderItems((prev) => [
      ...prev,
      {
        designItemId: item._id,
        title: item.title,
        quantity: 1,
        options: {
          fabric: { brand, collectionName, color: selected.color, },
        },
      },
    ]);
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
      selectedFabrics={selectedFabrics}
      fabricColors={fabricColors}
      onSelectFabric={selectFabric}
      onSelectColor={selectColor}
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
