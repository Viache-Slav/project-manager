import styles from './designFabrics.module.css';

const DesignFabricsView = ({
  loading,
  disabled,

  fabrics,

  brands,
  collections,

  draft,
  setDraft,

  editingRowId,
  rowPriceDraft,
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

      {!loading && (
        <>
          {(fabrics || []).length > 0 && (
            <div className={styles.list}>
              {(fabrics || []).map((f) => (
                <div key={f.id} className={styles.row}>
                  <div className={styles.left}>
                    <div className={styles.title}>
                      {f.brand} / {f.collectionName}
                    </div>

                    <div className={styles.sub}>
                      {editingRowId === f.id ? (
                        <span className={styles.priceEditInline}>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            autoFocus
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
                          />
                          <button onClick={() => onSaveRowPrice(f)}>
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingRowId(null);
                              setRowPriceDraft('');
                            }}
                          >
                            ✕
                          </button>
                        </span>
                      ) : (
                        <span
                          className={styles.priceView}
                          onClick={() => {
                            if (disabled) return;
                            setEditingRowId(f.id);
                            setRowPriceDraft(
                              f.pricePerMeter === null ||
                                f.pricePerMeter === undefined
                                ? ''
                                : String(f.pricePerMeter)
                            );
                          }}
                        >
                          Price: {Number(f.pricePerMeter) || 0} zł / m ✏
                        </span>
                      )}
                    </div>
                  </div>

                  {!disabled && (
                    <button
                      className={styles.remove}
                      onClick={() => onRemove(f.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {!disabled && (
            <div className={styles.editor}>
              <label className={styles.label}>
                Brand
                <select
                  value={draft.brand}
                  onChange={(e) =>
                    setDraft({
                      brand: e.target.value,
                      collectionName: '',
                      pricePerMeter: 0,
                      editingPrice: false,
                    })
                  }
                >
                  {brands.length === 0 && (
                    <option value="Davis">Davis</option>
                  )}

                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.label}>
                Collection
                <select
                  value={draft.collectionName}
                  onChange={(e) => {
                    const name = e.target.value;
                    const col = collections.find(
                      (c) => c.name === name
                    );

                    setDraft((prev) => ({
                      ...prev,
                      collectionName: name,
                      pricePerMeter: col?.pricePerMeter ?? 0,
                      editingPrice:
                        (col?.pricePerMeter ?? 0) === 0,
                    }));
                  }}
                >
                  <option value="">
                    Select collection
                  </option>

                  {collections.map((c) => (
                    <option
                      key={`${draft.brand}-${c.name}`}
                      value={c.name}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              {draft.collectionName && (
                <label className={styles.label}>
                  Price per meter

                  {draft.editingPrice ? (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.pricePerMeter}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          pricePerMeter: e.target.value,
                        }))
                      }
                      onBlur={() => {
                        /* handled in container */
                      }}
                    />
                  ) : (
                    <div
                      className={styles.priceView}
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          editingPrice: true,
                        }))
                      }
                    >
                      {Number(draft.pricePerMeter) || 0} zł / m ✏
                    </div>
                  )}
                </label>
              )}

              <button className={styles.add} onClick={onAdd}>
                + Add
              </button>
            </div>
          )}

          {disabled && (
            <div className={styles.hint}>
              Collections can be edited only in status
              "submitted"
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default DesignFabricsView;
