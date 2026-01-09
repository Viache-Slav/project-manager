import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './publicDesignItems.module.css';

const PublicDesignItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
        </div>
      ))}
    </div>
  );
};

export default PublicDesignItems;
