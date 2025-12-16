import { useState } from 'react';
import axios from '../../api/axios';
import styles from './UploadForm.module.css';

const UploadForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    article: '',
    class: '',
    productPrice: '',
    image: '',
  });

  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setStatus({ type: '', text: '' });
    setLoading(true);

    try {
      const payload = {
        ...form,
        productPrice: Number(form.productPrice),
        materials: [],
      };

      const { data } = await axios.post('/products', payload);

      setStatus({
        type: 'success',
        text: `Product created: ${data.title} (${data.article})`,
      });

      if (onCreated) {
        onCreated();
      }

      setForm({
        title: '',
        description: '',
        article: '',
        class: '',
        productPrice: '',
        image: '',
      });

      setTimeout(() => {
        setStatus({ type: '', text: '' });
      }, 3000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create product';

      setStatus({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
      <h3>Add new product</h3>

      {status.text && (
        <div
          className={`${styles.notice} ${
            status.type === 'success' ? styles.success : styles.error
          }`}
        >
          {status.text}
        </div>
      )}

      <div className={styles.section}>
        <h4>Basic information</h4>

        <label>
          Name
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
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
              required
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
      </div>

      <div className={styles.section}>
        <h4>Price</h4>

        <label>
          Product price (€)
          <input
            type="number"
            name="productPrice"
            value={form.productPrice}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className={styles.section}>
        <h4>Image</h4>

        <label>
          Image URL
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
          />
        </label>
      </div>

      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? 'Creating...' : 'Create product'}
      </button>
    </form>
  );
};

export default UploadForm;
