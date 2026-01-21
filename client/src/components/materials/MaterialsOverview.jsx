import { useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
import MaterialsOverviewView from './MaterialsOverviewView';

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
        const categoryId =
          typeof m.category === 'string'
            ? m.category
            : m.category?._id;

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

  const deleteMaterial = async (m) => {
    if (!confirm('Delete this material?')) return;

    await axios.delete(`/materials/${m._id}`);

    setMaterials((prev) =>
      prev.filter((x) => x._id !== m._id)
    );
  };

  const startEditPrice = (m) => {
    setEditingId(m._id);
    setPriceDraft(m.price ?? '');
  };

  const cancelEditPrice = () => {
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
        x._id === m._id
          ? { ...x, price: value }
          : x
      )
    );

    cancelEditPrice();
  };

  const startEditQty = (m) => {
    setEditingQtyId(m._id);
    setQtyDraft(m.quantity ?? '');
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

  return (
    <MaterialsOverviewView
      loading={loading}
      materials={filteredMaterials}
      categories={categories}
      selectedCategory={selectedCategory}
      search={search}

      editingId={editingId}
      priceDraft={priceDraft}
      editingQtyId={editingQtyId}
      qtyDraft={qtyDraft}

      onCategoryChange={setSelectedCategory}
      onSearchChange={setSearch}
      onDelete={deleteMaterial}

      onStartEditPrice={startEditPrice}
      onCancelEditPrice={cancelEditPrice}
      onPriceDraftChange={setPriceDraft}
      onSavePrice={savePrice}

      onStartEditQty={startEditQty}
      onQtyDraftChange={setQtyDraft}
      onSaveQty={saveQty}
    />
  );
};

export default MaterialsOverview;
