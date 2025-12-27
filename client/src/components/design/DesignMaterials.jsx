
import { useEffect, useState } from 'react';
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

const DesignMaterials = ({ status, materials, setMaterials }) => {
  const disabled = status !== 'submitted';

  const [categories, setCategories] = useState([]);
  const [drafts, setDrafts] = useState([]);

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

  const grouped = materials.reduce((acc, m) => {
    acc[m.categoryName] ||= [];
    acc[m.categoryName].push(m);
    return acc;
  }, {});

  return (
    <section className={styles.wrapper}>
      <h3>Calculation of materials</h3>

      {Object.entries(grouped).map(([cat, list]) => (
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

      {!disabled && drafts.length === 0 && (
        <button className={styles.add} onClick={startAdding}>
          + Add material
        </button>
      )}

      {!disabled &&
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

      {!disabled && drafts.length > 0 && canFix && (
        <button className={styles.fix} onClick={fixAll}>
          ✔ Fix
        </button>
      )}
    </section>
  );
};

export default DesignMaterials;
