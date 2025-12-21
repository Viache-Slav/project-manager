import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from './designCatalog.module.css';
import DesignItemUploadForm from './DesignItemUploadForm';

const DesignCatalog = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();

  const isAdmin = true;

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data } = await axios.get('/design-items');
    setItems(data);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    await axios.delete(`/design-items/${id}`);
    loadItems();
  };

  return (
    <>
      <section>
        <h3>Catalog</h3>

        <div className={styles.grid}>
          {items.map((item) => {
            const preview = item.images?.[0];

            return (
              <div
                key={item._id}
                className={styles.card}
                onClick={() => navigate(`/design-items/${item._id}`)}
              >
                {isAdmin && (
                  <div
                    className={styles.actions}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button onClick={() => setEditingItem(item)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </div>
                )}

                {preview && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/files/${preview}`}
                    alt={item.title}
                    className={styles.image}
                  />
                )}

                <div className={styles.content}>
                  <h4>{item.title}</h4>

                  <div className={styles.meta}>
                    <span>{item.type?.name || '—'}</span>
                    <span>{item.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {editingItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <DesignItemUploadForm
              editingItem={editingItem}
              onSaved={() => {
                setEditingItem(null);
                loadItems();
              }}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DesignCatalog;
