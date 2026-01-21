import { useEffect, useRef, useState } from 'react';
import axios from '../../../api/axios';
import DesignItemUploadFormView from './DesignItemUploadFormView';

const emptyForm = {
  title: '',
  type: '',
  width: '',
  height: '',
  depth: '',
  comment: '',
};

const DesignItemUploadForm = ({
  editingItem,
  onSaved,
  onCancel,
}) => {
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
        width:
          editingItem.dimensions?.width || '',
        height:
          editingItem.dimensions?.height || '',
        depth:
          editingItem.dimensions?.depth || '',
        comment: editingItem.comment || '',
      });
    } else {
      setForm(emptyForm);
      setSuccess('');
    }

    setFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [editingItem]);

  const handleChange = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
    setSuccess('');
  };

  const handleFiles = (e) => {
    setFiles((prev) => [
      ...prev,
      ...Array.from(e.target.files),
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (v !== '') fd.append(k, v);
      });

      fd.append(
        'dimensions',
        JSON.stringify({
          width: form.width || undefined,
          height: form.height || undefined,
          depth: form.depth || undefined,
        })
      );

      files.forEach((f) => fd.append('images', f));

      if (isEdit) {
        await axios.patch(
          `/design-items/${editingItem._id}`,
          fd,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );
        setSuccess('Item successfully updated');
      } else {
        await axios.post('/design-items', fd, {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        });

        setSuccess('Item successfully created');
        setForm(emptyForm);
        setFiles([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }

      onSaved?.();
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
    <DesignItemUploadFormView
      isEdit={isEdit}
      form={form}
      loading={loading}
      error={error}
      success={success}
      fileInputRef={fileInputRef}
      onChange={handleChange}
      onFiles={handleFiles}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

export default DesignItemUploadForm;
