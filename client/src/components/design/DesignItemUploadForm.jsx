import { useEffect, useState, useRef } from 'react';
import axios from '../../api/axios';
import styles from './DesignItemUploadForm.module.css';

const emptyForm = {
  title: '',
  type: '',
  width: '',
  height: '',
  depth: '',
  comment: '',
};

const DesignItemUploadForm = ({ editingItem, onSaved, onCancel }) => {
  const isEdit = Boolean(editingItem);

  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title || '',
        type: editingItem.type?.name || '',
        width: editingItem.dimensions?.width || '',
        height: editingItem.dimensions?.height || '',
        depth: editingItem.dimensions?.depth || '',
        comment: editingItem.comment || '',
      });
    } else {
      setForm(emptyForm);
      setFiles([]);
      setSuccess('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [editingItem]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setSuccess('');
  };

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isEdit) {
        await axios.patch(`/design-items/${editingItem._id}`, {
          ...form,
          dimensions: {
            width: form.width || undefined,
            height: form.height || undefined,
            depth: form.depth || undefined,
          },
        });

        setSuccess('Item successfully updated');
      } else {
        const fd = new FormData();

        files.forEach((f) => fd.append('images', f));

        Object.entries(form).forEach(([k, v]) => {
          if (v !== '') fd.append(k, v);
        });

        await axios.post('/design-items', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Item successfully created');
        setForm(emptyForm);
        setFiles([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }

      if (onSaved) onSaved();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Failed to save item'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>{isEdit ? 'Edit item' : 'New item'}</h3>

      {success && (
        <div className={styles.success}>
          {success}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {!isEdit && (
        <label>
          Photos
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFiles}
            required
          />
        </label>
      )}

      <label>
        Title {isEdit ? '' : '*'}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required={!isEdit}
        />
      </label>

      <label>
        Type {isEdit ? '' : '*'}
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          required={!isEdit}
        />
      </label>

      <div className={styles.row}>
        <label>
          Width {isEdit ? '' : '*'}
          <input
            name="width"
            value={form.width}
            onChange={handleChange}
            required={!isEdit}
          />
        </label>

        <label>
          Height {isEdit ? '' : '*'}
          <input
            name="height"
            value={form.height}
            onChange={handleChange}
            required={!isEdit}
          />
        </label>

        <label>
          Depth
          <input
            name="depth"
            value={form.depth}
            onChange={handleChange}
          />
        </label>
      </div>

      <label>
        Comment
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
        />
      </label>

      <div className={styles.actions}>
        <button type="submit" disabled={loading}>
          {loading
            ? 'Saving…'
            : isEdit
            ? 'Save changes'
            : 'Create item'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default DesignItemUploadForm;
