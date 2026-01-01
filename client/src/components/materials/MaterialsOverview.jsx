import { useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
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


const MaterialsOverview = () => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [priceDraft, setPriceDraft] = useState('');
  const [editingQtyId, setEditingQtyId] = useState(null);
  const [qtyDraft, setQtyDraft] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get('/materials'),
      axios.get('/material-categories'),
    ])
      .then(([materialsRes, categoriesRes]) => {
        setMaterials(materialsRes.data);
        setCategories(categoriesRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      if (selectedCategory !== 'all') {
        if (!m.category) return false;

        const categoryId =
          typeof m.category === 'string'
            ? m.category
            : m.category._id;

        if (categoryId !== selectedCategory) return false;
      }

      if (search.trim()) {
        return m.name
          .toLowerCase()
          .includes(search.toLowerCase());
      }

      return true;
    });
  }, [materials, selectedCategory, search]);

  const startEdit = (material) => {
    setEditingId(material._id);
    setPriceDraft('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPriceDraft('');
  };

  const savePrice = async (m) => {
    const value = Number(priceDraft);
    if (Number.isNaN(value)) return;

    await axios.put(`/materials/${m._id}`, {
      price: value,
    });

    setMaterials((prev) =>
      prev.map((x) =>
        x._id === m._id ? { ...x, price: value } : x
      )
    );

    setEditingPriceId(null);
    setPriceDraft('');
  };

  const saveQty = async (m) => {
    const value = Number(qtyDraft);
    if (Number.isNaN(value)) return;

    await axios.put(`/materials/${m._id}`, {
      quantity: value,
    });

    setMaterials((prev) =>
      prev.map((x) =>
        x._id === m._id
          ? { ...x, quantity: value }
          : x
      )
    );

    setEditingQtyId(null);
    setQtyDraft('');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Materials</h3>

      <div className={styles.filter}>
        <label>
          Category:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
          onChange={(e) => setSearch(e.target.value)}
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
          {filteredMaterials.map((m) => (
            <tr key={m._id}>
              <td>
                <button
                  className={styles.delete}
                  onClick={async () => {
                    if (!confirm('Delete this material?')) return;

                    await axios.delete(`/materials/${m._id}`);

                    setMaterials((prev) =>
                      prev.filter((x) => x._id !== m._id)
                    );
                  }}
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
                      placeholder={m.price ?? 0}
                      value={priceDraft}
                      onChange={(e) => setPriceDraft(e.target.value)}
                    />

                    {priceDraft && (
                      <button
                        className={styles.save}
                        onClick={() => savePrice(m)}
                      >
                        Save
                      </button>
                    )}

                    <button
                      className={styles.cancel}
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span
                    className={styles.price}
                    onClick={() => startEdit(m)}
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
                        setQtyDraft(e.target.value)
                      }
                    />
                    <button
                      className={styles.save}
                      onClick={() => saveQty(m)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <span
                    onClick={() => {
                      setEditingQtyId(m._id);
                      setQtyDraft(m.quantity ?? '');
                    }}
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

export default MaterialsOverview;
