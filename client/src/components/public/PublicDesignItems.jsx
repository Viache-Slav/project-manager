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

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

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
        fabricImageId: null,
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

  const selectColor = (itemId, color, imageId) => {
    setSelectedFabrics((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        color,
      fabricImageId: imageId,
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

    setOrderItems((prev) => {
      const existingIndex = prev.findIndex((i) =>
        i.designItemId === item._id &&
        i.options.fabric.brand === brand &&
        i.options.fabric.collectionName === collectionName &&
        i.options.fabric.color === selected.color
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
          subtotal:
            (updated[existingIndex].quantity + 1) *
            updated[existingIndex].price,
        };
        return updated;
      }

      return [
        ...prev,
        {
          designItemId: item._id,
          title: item.title,
          quantity: 1,
          price: item.salePrice,
          subtotal: item.salePrice,
          productImageId: item.images?.[0] || null,
          options: {
            fabric: {
              brand,
              collectionName,
              color: selected.color,
              imageId: selected.fabricImageId || null,
            },
          },
        },
      ];
    });
  };

  const increaseQty = (index) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + 1,
        subtotal:
          (updated[index].quantity + 1) *
          updated[index].price,
      };
      return updated;
    });
  };

  const decreaseQty = (index) => {
    setOrderItems((prev) => {
      const updated = [...prev];

      if (updated[index].quantity === 1) {
        updated.splice(index, 1);
        return updated;
      }

      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity - 1,
        subtotal:
          (updated[index].quantity - 1) *
          updated[index].price,
      };

      return updated;
    });
  };

  const removeItem = (index) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
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
      totalPrice={totalPrice} 
      selectedFabrics={selectedFabrics}
      fabricColors={fabricColors}
      onSelectFabric={selectFabric}
      onSelectColor={selectColor}
      isAuth={isAuth}
      customer={customer}
      showAuthModal={showAuthModal}
      onAddToOrder={addToOrder}
      onIncreaseQty={increaseQty}
      onDecreaseQty={decreaseQty}
      onRemoveItem={removeItem}
      onSubmitOrder={submitOrder}
      onOpenAuth={() => setShowAuthModal(true)}
      onCloseAuth={() => setShowAuthModal(false)}
    />
  );
};

export default PublicDesignItems;
