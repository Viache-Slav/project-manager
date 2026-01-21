import styles from './materialsOverview.module.css';

const formatPrice = (value) => {
  if (value === null || value === undefined) return '0.00 zł';

  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const MaterialsOverviewView = ({
  loading,
  materials,
  categories,
  selectedCategory,
  search,

  editingId,
  priceDraft,
  editingQtyId,
  qtyDraft,

  onCategoryChange,
  onSearchChange,
  onDelete,
  onStartEditPrice,
  onCancelEditPrice,
  onPriceDraftChange,
  onSavePrice,

  onStartEditQty,
  onQtyDraftChange,
  onSaveQty,
}) => {
  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Materials</h3>

      <div className={styles.filter}>
        <label>
          Category:
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Qty</th>
          </tr>
        </thead>

        <tbody>
          {materials.map((m) => (
            <tr key={m._id}>
              <td>
                <button
                  className={styles.delete}
                  onClick={() => onDelete(m)}
                >
                  ✕
                </button>
              </td>

              <td>{m.name}</td>
              <td>{m.unit}</td>

              <td>
                {editingId === m._id ? (
                  <div className={styles.priceEdit}>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      autoFocus
                      value={priceDraft}
                      onChange={(e) =>
                        onPriceDraftChange(e.target.value)
                      }
                    />

                    {priceDraft !== '' && (
                      <button
                        className={styles.save}
                        onClick={() => onSavePrice(m)}
                      >
                        Save
                      </button>
                    )}

                    <button
                      className={styles.cancel}
                      onClick={onCancelEditPrice}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span
                    className={styles.price}
                    onClick={() => onStartEditPrice(m)}
                  >
                    {formatPrice(m.price)}
                  </span>
                )}
              </td>

              <td>
                {editingQtyId === m._id ? (
                  <>
                    <input
                      type="number"
                      autoFocus
                      value={qtyDraft}
                      onChange={(e) =>
                        onQtyDraftChange(e.target.value)
                      }
                    />
                    <button
                      className={styles.save}
                      onClick={() => onSaveQty(m)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <span
                    onClick={() => onStartEditQty(m)}
                  >
                    {m.quantity ?? '—'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialsOverviewView;
