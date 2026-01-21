import styles from './designCatalog.module.css';
import DesignItemUploadForm from '../upload/DesignItemUploadForm';

const DesignCatalogView = ({
  items,
  isAdmin,
  onOpenItem,
  onEdit,
  onDelete,
  editingItem,
  onSaved,
  onCancelEdit,
}) => {
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
                onClick={() => onOpenItem(item._id)}
              >
                {isAdmin && (
                  <div
                    className={styles.actions}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button onClick={() => onEdit(item)}>
                      Edit
                    </button>

                    <button onClick={() => onDelete(item._id)}>
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
              onSaved={onSaved}
              onCancel={onCancelEdit}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DesignCatalogView;
