import { useState } from 'react';
import axios from '../../api/axios';
import styles from './catalog.module.css';

const ProductEditModal = ({ product, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: product.title || '',
    description: product.description || '',
    article: product.article || '',
    class: product.class || '',
    productPrice: product.productPrice || '',
    image: product.image || '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    await axios.patch(`/products/${product._id}`, form);
    onSaved();
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>Edit product</h3>

        <label>
          Name
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <div className={styles.row}>
          <label>
            Article
            <input
              name="article"
              value={form.article}
              onChange={handleChange}
            />
          </label>

          <label>
            Class
            <input
              name="class"
              value={form.class}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className={styles.row}>
          <label>
            Price (€)
            <input
              type="number"
              name="productPrice"
              value={form.productPrice}
              onChange={handleChange}
            />
          </label>

          <label>
            Image URL
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className={styles.modalActions}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;
