import styles from './designFabrics.module.css';

const renderPrice = (value) =>
  typeof value === 'number'
    ? `${value} zł / m`
    : '—';

const DesignFabricsView = ({
  loading,
  disabled,
  fabrics,
  brands,
  collections,
  draft,
  editingRowId,
  rowPriceDraft,
  getPrice,
  setDraft,
  setEditingRowId,
  setRowPriceDraft,
  onAdd,
  onRemove,
  onSaveRowPrice,
}) => {
  return (
    <section className={styles.wrapper}>
      <h3>Fabrics for client</h3>

      {loading && <div>Loading fabrics...</div>}

      {!loading &&
        fabrics.map((f) => {

          return (
            <div key={f.id} className={styles.row}>
              <div>
                <strong>
                  {f.brand} / {f.collectionName}
                </strong>

                <div>Meterage: {f.meterage} m</div>

                {editingRowId === f.id ? (
                  <div className={styles.priceEdit}>
                    <input
                      type="number"
                      value={rowPriceDraft}
                      onChange={(e) =>
                        setRowPriceDraft(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onSaveRowPrice(f);
                        }
                        if (e.key === 'Escape') {
                          setEditingRowId(null);
                          setRowPriceDraft('');
                        }
                      }}
                      autoFocus
                    />
                    <button className={styles.save} 
                      onClick={() => onSaveRowPrice(f)}>
                        Save
                    </button>
                  </div>
                ) : (
                  <div
                    className={styles.priceView}
                    onClick={() => {
                      if (disabled) return;
                      setEditingRowId(f.id);
                      setRowPriceDraft(f.price ?? '');
                    }}
                  >
                    Price: {renderPrice(f.price)}
                  </div>
                )}
                <div className={styles.total}>
                  Total:{' '}
                  <strong>
                    {typeof f.total === 'number'
                      ? `${f.total.toFixed(2)} zł`
                      : '—'}
                  </strong>
                </div>
              </div>

              {!disabled && (
                <button onClick={() => onRemove(f.id)}>✕</button>
              )}
            </div>
          );
        })}

      {!disabled && (
        <div className={styles.editor}>
          <select
            value={draft.brand}
            onChange={(e) =>
              setDraft({
                brand: e.target.value,
                collectionName: '',
                meterage: '',
              })
            }
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={draft.collectionName}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                collectionName: e.target.value,
              }))
            }
          >
            <option value="">Select collection</option>
            {collections.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Meterage"
            value={draft.meterage}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                meterage: e.target.value,
              }))
            }
          />

          <div>
            Price: {renderPrice(getPrice(draft.brand, draft.collectionName))}
          </div>

          <button onClick={onAdd}>+ Add</button>
        </div>
      )}
    </section>
  );
};

export default DesignFabricsView;
