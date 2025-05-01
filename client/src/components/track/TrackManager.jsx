import React, { useEffect, useState } from 'react';
import styles from './TrackManager.module.css';

const TrackManager = () => {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [departureTime, setDepartureTime] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/routes', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
      } else {
        console.error('Error in receiving traces');
      }
    } catch (error) {
      console.error('Error in receiving traces:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Error in receiving products');
      }
    } catch (error) {
      console.error('Error in receiving products:', error);
    }
  };

  const handleCreateClick = () => {
    setShowForm(true);
    fetchProducts();
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.productId === productId);
      if (exists) {
        return prev.map(p =>
          p.productId === productId ? { ...p, quantity: Number(quantity) } : p
        );
      } else {
        return [...prev, { productId, quantity: Number(quantity) }];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          departureTime,
          items: selectedProducts
        }),
      });

      if (response.ok) {
        alert('The track has been successfully created');
        setDepartureTime('');
        setSelectedProducts([]);
        setShowForm(false);
        fetchRoutes();
      } else {
        alert('Error when creating a trace');
      }
    } catch (error) {
      console.error('Error when creating a trace:', error);
      alert('Error when creating a trace');
    }
  };

  return (
    <div className={styles['track-manager']}>
      <h2>Trace planner</h2>

      <button onClick={handleCreateClick} className={styles['track-manager__button']}>
        Create a track
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles['track-manager__form']}>
          <label>
            Dispatch time:
            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
            />
          </label>

          <h3>Products:</h3>
          {products.map((product) => (
            <div key={product._id}>
              <span>{product.name}</span>
              <input
                type="number"
                min="0"
                placeholder="Quantity"
                onChange={(e) => handleQuantityChange(product._id, e.target.value)}
              />
            </div>
          ))}

          <button type="submit" className={styles['track-manager__button']}>
          Save the track
          </button>
        </form>
      )}

      <h3>Existing tracks:</h3>
      <ul className={styles['track-manager__list']}>
        {routes.map((route) => (
          <li key={route._id} className={styles['track-manager__item']}>
            <strong>{new Date(route.departureTime).toLocaleString()}</strong> — items: {route.items.length}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackManager;
