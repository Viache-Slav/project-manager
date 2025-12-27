import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './designInfo.module.css';

const DesignInfo = ({ item }) => {
  const { title, type, images, dimensions, comment, _id } = item;
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/auth/user').then(res => setUser(res.data));
  }, []);

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Delete this image?')) return;

    await axios.delete(`/design-items/${_id}/images/${imageId}`);
    window.location.reload();
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.gallery}>
        {images.map((id) => (
          <div key={id} className={styles.imageWrapper}>
            <img
              src={`${import.meta.env.VITE_API_URL}/files/${id}`}
              alt={title}
              className={styles.image}
            />

            {['admin', 'designer'].includes(user?.role) && (
              <button
                className={styles.remove}
                onClick={() => handleDeleteImage(id)}
                title="Delete image"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Product type:</span>
        <span>{type?.name || '—'}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Dimensions:</span>
        <span>
          {dimensions.width} × {dimensions.height}
          {dimensions.depth ? ` × ${dimensions.depth}` : ''}
        </span>
      </div>

      {comment && (
        <div className={styles.comment}>
          <span className={styles.label}>Comment:</span>
          <p>{comment}</p>
        </div>
      )}
    </section>
  );
};

export default DesignInfo;
