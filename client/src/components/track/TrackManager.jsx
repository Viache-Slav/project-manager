import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import TrackManagerView from './TrackManagerView';

const TrackManager = () => {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [departureTime, setDepartureTime] = useState('');
  const [selectedFabrics, setSelectedFabrics] = useState({});
  const [fabricColors, setFabricColors] = useState({});
  const [fabricMeta, setFabricMeta] = useState([]);
  const [trackItems, setTrackItems] = useState({});

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const { data } = await axios.get('/routes');
    setRoutes(data);
  };

  const fetchOrders = async () => {
    const { data } = await axios.get('/orders');
    setOrders(data.filter((o) => o.status === 'confirmed'));
  };

  const fetchProducts = async () => {
    const { data } = await axios.get('/design-items/public/design-items');
    setProducts(data);
    setQuantities({});
  };

  const fetchFabricMeta = async () => {
    const { data } = await axios.get('/fabrics/meta');
    setFabricMeta(data);
  };

  const handleCreateClick = () => {
    setShowForm(true);
    fetchOrders();
    fetchProducts();
    fetchFabricMeta();
  };

  const handleSelectBrand = (productId, brand) => {
    setSelectedFabrics((prev) => ({
      ...prev,
      [productId]: {
        step: 'collection',
        brand,
        collection: '',
        color: '',
      },
    }));
  };

  const handleSelectCollection = async (productId, collection) => {
    const brand = selectedFabrics[productId].brand;

    const { data } = await axios.get('/fabrics/colors', {
      params: { brand, collectionName: collection },
    });

    setFabricColors((prev) => ({ ...prev, [productId]: data }));

    setSelectedFabrics((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], step: 'color', collection },
    }));
  };

  const handleSelectColor = (productId, color) => {
    setSelectedFabrics((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], step: 'done', color },
    }));
  };

  const resetFabricSelection = (productId) => {
    setSelectedFabrics((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const handleQuantityChange = (productId, value) => {
    const qty = Number(value);

    setQuantities((prev) => ({ ...prev, [productId]: qty }));

    setTrackItems((prev) => ({
      ...prev,
      [productId]: {
        source: 'manual',
        productId,
        quantity: qty,
        fabric: selectedFabrics[productId] || null,
      },
    }));
  };

  const isOrderAddedToTrack = (orderId) => {
    return Object.values(trackItems).some(
      (item) => item.source === 'order' && item.orderId === orderId
    );
  };

  const addOrderToTrack = (order) => {
    const newItems = {};

    order.items.forEach((item) => {
      const key = `${order._id}_${item.designItem}`;

      newItems[key] = {
        source: 'order',
        orderId: order._id,
        productId: item.designItem,
        designItemId: item.designItem,
        title: item.title,
        quantity: item.quantity,
        fabric: item.fabric || null,
      };
    });

    setTrackItems((prev) => ({
      ...prev,
      ...newItems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const items = Object.values(trackItems).map((i) => ({
      productId: i.productId || i.designItemId,
      quantity: i.quantity,
      fabric: i.fabric || null,
      source: i.source,
      orderId: i.orderId || null,
    }));

    if (!departureTime || items.length === 0) {
      alert('Please provide dispatch time and at least one product with quantity.');
      return;
    }

    try {
      await axios.post('/routes', {
        departureTime,
        items,
      });

      alert('Track successfully created');
      setDepartureTime('');
      setTrackItems({});
      setQuantities({});
      setShowForm(false);
      fetchOrders();
      fetchRoutes();
    } catch (err) {
      console.error('Error when creating a track:', err);
      alert('Error when creating a track');
    }
  };

  return (
    <TrackManagerView
      routes={routes}
      showForm={showForm}
      orders={orders}
      products={products}
      quantities={quantities}
      departureTime={departureTime}
      selectedFabrics={selectedFabrics}
      fabricColors={fabricColors}
      fabricMeta={fabricMeta}
      trackItems={trackItems}
      setDepartureTime={setDepartureTime}
      setShowForm={setShowForm}
      handleCreateClick={handleCreateClick}
      handleSubmit={handleSubmit}
      handleSelectBrand={handleSelectBrand}
      handleSelectCollection={handleSelectCollection}
      handleSelectColor={handleSelectColor}
      resetFabricSelection={resetFabricSelection}
      handleQuantityChange={handleQuantityChange}
      isOrderAddedToTrack={isOrderAddedToTrack}
      addOrderToTrack={addOrderToTrack}
    />
  );
};

export default TrackManager;
