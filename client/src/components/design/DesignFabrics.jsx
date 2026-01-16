import { useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
import styles from './designFabrics.module.css';

const DesignFabrics = ({ status, fabrics, setFabrics }) => {
  const disabled = status !== 'submitted';

  const [allFabrics, setAllFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [draft, setDraft] = useState({
    brand: 'Davis',
    collection: '',
    pricePerMeter: 0,
    editingPrice: false,
  });

  const [editingRowId, setEditingRowId] = useState(null);
  const [rowPriceDraft, setRowPriceDraft] = useState('');

  useEffect(() => {
    axios
      .get('/fabrics/meta') 
      .then((res) => setAllFabrics(res.data))
      .finally(() => setLoading(false));
  }, []);

  const collectionsByBrand = useMemo(() => {
    const map = {};

    for (const row of allFabrics) {
      if (!row.brand || !Array.isArray(row.collections)) continue;

      map[row.brand] ||= [];

      for (const c of row.collections) {
        if (!c?.name) continue;
        if (!map[row.brand].some(x => x.name === c.name)) {
          map[row.brand].push({
            name: c.name,
            pricePerMeter: c.pricePerMeter ?? 0,
          });
        }
      }
    }

    return map;
    }, [allFabrics]);

  const brands = useMemo(() => Object.keys(collectionsByBrand), [collectionsByBrand]);

  const collections = useMemo(() => {
    return collectionsByBrand[draft.brand] || [];
  }, [collectionsByBrand, draft.brand]);

  const add = () => {
    if (!draft.brand || !draft.collection) {
      alert('Select brand and collection');
      return;
    }

    const exists = (fabrics || []).some(
      (x) => x.brand === draft.brand && x.collection === draft.collection
    );
    if (exists) {
      alert('This collection is already added');
      return;
    }

    setFabrics((prev) => [
      ...(prev || []),
      {
        id: crypto.randomUUID(),
        brand: draft.brand,
        collection: draft.collection,
        pricePerMeter: Number(draft.pricePerMeter) || 0,
      },
    ]);

    setDraft((prev) => ({
      ...prev,
      collection: '',
      pricePerMeter: 0,
      editingPrice: false,
    }));
  };

  const remove = (id) => {
    setFabrics((prev) => (prev || []).filter((x) => x.id !== id));
  };

  const saveRowPrice = async (row) => {
    const value = Number(rowPriceDraft);

    if (!Number.isFinite(value) || value < 0) {
      alert('Invalid price');
      return;
    }

    await axios.put('/fabrics/collection-price', {
      brand: row.brand,
      collection: row.collection,
      pricePerMeter: value,
    });

    setFabrics((prev) =>
      (prev || []).map((x) =>
        x.id === row.id ? { ...x, pricePerMeter: value } : x
      )
    );

    setEditingRowId(null);
    setRowPriceDraft('');
  };

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
                      {f.brand} / {f.collection}
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
                            onChange={(e) => setRowPriceDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRowPrice(f);
                              if (e.key === 'Escape') {
                                setEditingRowId(null);
                                setRowPriceDraft('');
                              }
                            }}
                          />
                          <button onClick={() => saveRowPrice(f)}>Save</button>
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
                              f.pricePerMeter === null || f.pricePerMeter === undefined
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
                      onClick={() => remove(f.id)}
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
                      collection: '',
                      pricePerMeter: 0,
                      editingPrice: false,
                    })
                  }
                >
                  {brands.length === 0 && (
                    <option key="fallback-davis" value="Davis">
                      Davis
                    </option>
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
                  value={draft.collection}
                  onChange={(e) => {
                    const name = e.target.value;
                    const col = collections.find((c) => c.name === name);

                    setDraft((prev) => ({
                      ...prev,
                      collection: name,
                      pricePerMeter: col?.pricePerMeter ?? 0,
                      editingPrice: (col?.pricePerMeter ?? 0) === 0,
                    }));
                  }}
                >
                  <option key="placeholder-collection" value="">
                    Select collection
                  </option>

                  {collections.map((c) => (
                    <option key={`${draft.brand}-${c.name}`} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              {draft.collection && (
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
                      onBlur={async () => {
                        const value = Number(draft.pricePerMeter);
                        if (!Number.isFinite(value) || value < 0) return;

                        await axios.put('/fabrics/collection-price', {
                          brand: draft.brand,
                          collection: draft.collection,
                          pricePerMeter: value,
                        });

                        const { data } = await axios.get('/fabrics/meta');
                        setAllFabrics(data);

                        setDraft((d) => ({
                          ...d,
                          editingPrice: false,
                        }));
                      }}
                    />
                  ) : (
                    <div
                      className={styles.priceView}
                      onClick={() =>
                        setDraft((d) => ({ ...d, editingPrice: true }))
                      }
                    >
                      {Number(draft.pricePerMeter) || 0} zł / m ✏
                    </div>
                  )}
                </label>
              )}

              <button className={styles.add} onClick={add}>
                + Add
              </button>
            </div>
          )}

          {disabled && (
            <div className={styles.hint}>
              Collections can be edited only in status "submitted"
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default DesignFabrics;
