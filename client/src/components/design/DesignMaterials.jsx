import { useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
import MaterialRow from './MaterialRow';
import styles from './designMaterials.module.css';

const createDraft = (category = null) => ({
  id: crypto.randomUUID(),
  categoryId: category?.categoryId || '',
  categoryName: category?.categoryName || '',
  materialId: '',
  materialName: '',
  quantity: '',
  unit: '',
});

const formatMoney = (value) => {
  if (value === null || value === undefined) return '—';

  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const DesignMaterials = ({
  status,
  materials,
  setMaterials,
  calculation,
  onUpdated,
}) => {
  const disabled = status !== 'submitted';

  const [categories, setCategories] = useState([]);
  const [drafts, setDrafts] = useState([]);

  const [editingPriceId, setEditingPriceId] = useState(null);
  const [priceDraft, setPriceDraft] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await axios.get(
      '/material-categories?withMaterials=true'
    );
    setCategories(data);
  };

  const startAdding = () => {
    setDrafts([createDraft()]);
  };

  const updateDraft = (id, updated) => {
    setDrafts((prev) => {
      const next = prev.map((d) =>
        d.id === id ? updated : d
      );

      const index = next.findIndex((d) => d.id === id);
      const d = next[index];

      const isComplete =
        d.categoryId &&
        d.materialId &&
        Number(d.quantity) > 0 &&
        d.unit;

      const hasNext = next[index + 1];

      if (isComplete && !hasNext) {
        next.push(
          createDraft({
            categoryId: d.categoryId,
            categoryName: d.categoryName,
          })
        );
      }

      return [...next];
    });
  };

  const canFix = drafts.some(
    (d) =>
      d.categoryId &&
      d.materialId &&
      Number(d.quantity) > 0 &&
      d.unit
  );

  const fixAll = () => {
    const ready = drafts.filter(
      (d) =>
        d.categoryId &&
        d.materialId &&
        Number(d.quantity) > 0 &&
        d.unit
    );

    setMaterials((prev) => [
      ...prev,
      ...ready.map((r) => ({
        ...r,
        id: crypto.randomUUID(),
      })),
    ]);

    setDrafts([]);
  };

  const removeItem = (id) => {
    setMaterials((prev) =>
      prev.filter((i) => i.id !== id)
    );
  };

  const editItem = (item) => {
    setMaterials((prev) =>
      prev.filter((i) => i.id !== item.id)
    );
    setDrafts([item]);
  };

  const groupedSubmitted = useMemo(() => {
    return materials.reduce((acc, m) => {
      acc[m.categoryName] ||= [];
      acc[m.categoryName].push(m);
      return acc;
    }, {});
  }, [materials]);

  const savePrice = async (materialId) => {
    const value = Number(priceDraft);
    if (!Number.isFinite(value) || value < 0) return;

    await axios.put(`/materials/${materialId}`, {
      price: value,
    });

    setEditingPriceId(null);
    setPriceDraft('');

    onUpdated?.();
  };

  const showCalculation =
    (status === 'to_approve' || status === 'approved') &&
    calculation;

  return (
    <section className={styles.wrapper}>
      <h3>Calculation of materials</h3>

      {!showCalculation &&
        Object.entries(groupedSubmitted).map(([cat, list]) => (
          <div key={cat} className={styles.group}>
            <div className={styles.groupTitle}>{cat}</div>

            {list.map((m) => (
              <div key={m.id} className={styles.fixedRow}>
                <span>
                  {m.materialName} — {m.quantity} {m.unit}
                </span>

                {!disabled && (
                  <div className={styles.actions}>
                    <button onClick={() => editItem(m)}>
                      Edit
                    </button>
                    <button onClick={() => removeItem(m.id)}>
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

      {!disabled && !showCalculation && drafts.length === 0 && (
        <button className={styles.add} onClick={startAdding}>
          + Add material
        </button>
      )}

      {!disabled &&
        !showCalculation &&
        drafts.map((d) => (
          <MaterialRow
            key={d.id}
            row={d}
            categories={categories}
            onChange={(updated) =>
              updateDraft(d.id, updated)
            }
          />
        ))}

      {!disabled && !showCalculation && drafts.length > 0 && canFix && (
        <button className={styles.fix} onClick={fixAll}>
          ✔ Fix
        </button>
      )}

      {showCalculation &&
        Object.entries(calculation.grouped || {}).map(
          ([cat, list]) => (
            <div key={cat} className={styles.group}>
              <div className={styles.groupTitle}>{cat}</div>

              {list.map((m) => (
                <div
                  key={m.materialId}
                  className={styles.fixedRow}
                >
                  <div className={styles.left}>
                    <div className={styles.mainLine}>
                      {m.name} — {m.amount} {m.unit}
                    </div>

                    <div className={styles.subLine}>
                      {editingPriceId === m.materialId ? (
                        <span className={styles.priceEditInline}>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            autoFocus
                            value={priceDraft}
                            onChange={(e) =>
                              setPriceDraft(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter')
                                savePrice(m.materialId);
                              if (e.key === 'Escape') {
                                setEditingPriceId(null);
                                setPriceDraft('');
                              }
                            }}
                          />

                          <button
                            className={styles.save}
                            onClick={() =>
                              savePrice(m.materialId)
                            }
                          >
                            Save
                          </button>

                          <button
                            className={styles.cancel}
                            onClick={() => {
                              setEditingPriceId(null);
                              setPriceDraft('');
                            }}
                          >
                            ✕
                          </button>
                        </span>
                      ) : (
                        <span
                          className={
                            m.price === 0
                              ? styles.zeroPrice
                              : styles.priceValue
                          }
                          onClick={() => {
                            setEditingPriceId(m.materialId);
                            setPriceDraft(
                              m.price === null ||
                                m.price === undefined
                                ? ''
                                : String(m.price)
                            );
                          }}
                        >
                          Price:{' '}
                          {m.price === null
                            ? '—'
                            : `${formatMoney(m.price)} / ${m.unit}`}
                        </span>
                      )}

                      <span className={styles.totalValue}>
                        Total: {formatMoney(m.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      {showCalculation && (
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>
              Materials cost:
            </span>
            <span className={styles.summaryValue}>
              {formatMoney(
                calculation.summary?.materialsCost ?? null
              )}
            </span>
          </div>

          {calculation.summary?.hasMissingPrices && (
            <div className={styles.missing}>
              Some materials have no price
            </div>
          )}

          {calculation.summary?.hasZeroPrices && (
            <div className={styles.missing}>
              Some materials have zero price
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default DesignMaterials;
