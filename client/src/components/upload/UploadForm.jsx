import React, { useState } from 'react';
import axios from '../../api/axios';
import styles from './UploadForm.module.css';

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/upload', { title, description });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  };

  return (
    <div className={styles['upload-form']}>
      <h2 className={styles['upload-form__title']}>Upload New Product</h2>

      <form onSubmit={handleSubmit} className={styles['upload-form__form']}>
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles['upload-form__input']}
        />
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles['upload-form__textarea']}
        />
        <button type="submit" className={styles['upload-form__button']}>
          Upload
        </button>
      </form>

      {success && <p className={styles['upload-form__success']}>Product uploaded successfully!</p>}
    </div>
  );
};

export default UploadForm;
