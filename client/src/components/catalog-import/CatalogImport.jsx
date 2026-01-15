import { useState } from 'react';
import axios from '../../api/axios';
import styles from './CatalogImport.module.css';

const CatalogImport = () => {
  const [brand, setBrand] = useState('Davis');
  const [collection, setCollection] = useState('');
  const [techZip, setTechZip] = useState(null);
  const [imagesZip, setImagesZip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!collection || !techZip || !imagesZip) {
      setMessage('Fill all fields and upload files');
      return;
    }

    const formData = new FormData();
    formData.append('brand', brand);
    formData.append('collection', collection);
    formData.append('techZip', techZip);
    formData.append('imagesZip', imagesZip);

    try {
      setLoading(true);

      await axios.post('/catalog-import/davis', formData);

      setMessage('Catalog imported successfully');
      setCollection('');
      setTechZip(null);
      setImagesZip(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Catalog import</h2>

      <form onSubmit={submit} className={styles.form}>
        <label>
          Brand
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="Davis">Davis</option>
            <option value="Fargotex" disabled>Fargotex (soon)</option>
            <option value="Nevotex" disabled>Nevotex (soon)</option>
          </select>
        </label>

        <label>
          Collection name
          <input
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            placeholder="Adventure"
            required
          />
        </label>

        <label>
          Technical card (ZIP)
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setTechZip(e.target.files[0])}
            required
          />
        </label>

        <label>
          Images (ZIP)
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setImagesZip(e.target.files[0])}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Importing...' : 'Import catalog'}
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default CatalogImport;
