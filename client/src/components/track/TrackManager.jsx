import React, { useEffect, useState } from 'react';
import styles from './TrackManager.module.css';

const TrackManager = () => {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [trackItems, setTrackItems] = useState([{ productId: '', quantity: 0 }]);
  const [departureTime, setDepartureTime] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/routes', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setRoutes(data);
      } else {
        console.error('Error in receiving traces:', res.statusText);
      }
    } catch (err) {
      console.error('Error in receiving traces:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        console.log("Loaded products:", data);
      } else {
        console.error('Error in receiving products:', res.statusText);
      }
    } catch (err) {
      console.error('Error in receiving products:', err);
    }
  };

  const handleCreateClick = () => {
    setShowForm(true);
    fetchProducts();
  };

  const handleTrackItemChange = (index, field, value) => {
    setTrackItems(prev => {
      const updated = [...prev];
      updated[index][field] = field === 'quantity' ? Number(value) : value;
      console.log("Updated trackItems:", updated);
      return updated;
    });
  };

  const addTrackItem = () => {
    setTrackItems(prev => {
      const updated = [...prev, { productId: '', quantity: 0 }];
      console.log("Added new track item:", updated);
      return updated;
    });
  };

  const removeTrackItem = (index) => {
    setTrackItems(prev => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Submitting track with items:", trackItems);

    try {
      const response = await fetch('http://localhost:5000/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          departureTime,
          items: trackItems
        }),
      });

      if (response.ok) {
        alert('The track has been successfully created');
        setDepartureTime('');
        setTrackItems([{ productId: '', quantity: 0 }]);
        setShowForm(false);
        fetchRoutes();
      } else {
        alert('Error when creating a track');
      }
    } catch (err) {
      console.error('Error when creating a trace:', err);
      alert('Error when creating a trace');
    }
  };

  return (
    <div className={styles['track-manager']}>
      <h2 className={styles['track-manager__heading']}>Trace planner</h2>

      <button className={styles['track-manager__button']} onClick={handleCreateClick}>
        Create a track
      </button>

      {showForm && (
        <form className={styles['track-manager__form']} onSubmit={handleSubmit}>
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
          {trackItems.map((item, index) => (
            <div key={index} className={styles['track-manager__row']}>
              <select
                value={item.productId}
                onChange={(e) => handleTrackItemChange(index, 'productId', e.target.value)}
                className={styles['track-manager__select']}
              >
                <option value="">Select a product</option>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.title}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No products available</option>
                )}
              </select>
              <input
                type="number"
                min="0"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleTrackItemChange(index, 'quantity', e.target.value)}
                className={styles['track-manager__input']}
              />
              <button
                type="button"
                onClick={() => removeTrackItem(index)}
                className={styles['track-manager__remove-button']}
              >
                ✕
              </button>
            </div>
          ))}

          <button type="button" className={styles['track-manager__button']} onClick={addTrackItem}>
            + Add product
          </button>

          <button className={styles['track-manager__button']} type="submit">
            Save the track
          </button>
        </form>
      )}

      <h3>Existing tracks:</h3>
      <ul className={styles['track-manager__list']}>
        {routes.map((route) => (
          <li className={styles['track-manager__item']} key={route._id}>
            <strong>{new Date(route.departureTime).toLocaleString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}</strong> — items: {route.items.length}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackManager;
