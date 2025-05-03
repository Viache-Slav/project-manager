import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './TrackManager.module.css';

const TrackManager = () => {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [departureTime, setDepartureTime] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const { data } = await axios.get('/routes');
      setRoutes(data);
    } catch (err) {
      console.error('Error fetching routes:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/products');
      setProducts(data);
      setQuantities({});
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleCreateClick = () => {
    setShowForm(true);
    fetchProducts();
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    if (!departureTime || items.length === 0) {
      alert('Please provide dispatch time and at least one product with quantity.');
      return;
    }

    try {
      await axios.post('/routes', {
        departureTime,
        items
      });

      alert('Track successfully created');
      setDepartureTime('');
      setQuantities({});
      setShowForm(false);
      fetchRoutes();
    } catch (err) {
      console.error('Error when creating a track:', err);
      alert('Error when creating a track');
    }
  };

  return (
    <div className={styles['track-manager']}>
      <h2 className={styles['track-manager__heading']}>Track Planner</h2>

      <button className={styles['track-manager__button']} onClick={handleCreateClick}>
        Create a Track
      </button>

      {showForm && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <form onSubmit={handleSubmit}>
              <label className={styles['track-manager__label']}>
                Dispatch time:
                <input
                  type="datetime-local"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  required
                  className={styles['track-manager__input']}
                />
              </label>

              <h3>Products:</h3>
              <div className={styles['products-grid']}>
                {products.map(product => (
                  <div key={product._id} className={styles['track-manager__row']}>
                    <label className={styles['track-manager__label']}>
                      {product.title}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99999"
                      value={quantities[product._id] || ''}
                      onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                      className={`${styles['track-manager__input']} ${styles['track-manager__input--quantity']}`}
                    />
                  </div>
                ))}
              </div>

              <button className={styles['track-manager__button']} type="submit">
                Save the Track
              </button>
              <button
                type="button"
                className={styles['track-manager__button']}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <h3>Existing Tracks:</h3>
      <ul className={styles['track-manager__list']}>
        {routes.map((route) => (
          <li className={styles['track-manager__item']} key={route._id}>
            <strong>{new Date(route.departureTime).toLocaleString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}</strong> — items: {route.items.reduce((sum, item) => sum + item.quantity, 0)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackManager;
