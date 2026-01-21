import { useEffect, useMemo, useState } from 'react';
import axios from '../../../api/axios';
import DesignMaterialsView from './DesignMaterialsView';

const createDraft = (category = null) => ({
  id: crypto.randomUUID(),
  categoryId: category?.categoryId || '',
  categoryName: category?.categoryName || '',
  materialId: '',
  materialName: '',
  quantity: '',
  unit: '',
});

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
    axios
      .get('/material-categories?withMaterials=true')
      .then((res) => setCategories(res.data));
  }, []);

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

      if (isComplete && !next[index + 1]) {
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

  return (
    <DesignMaterialsView
      disabled={disabled}
      status={status}
      materials={materials}
      drafts={drafts}
      categories={categories}
      calculation={calculation}
      groupedSubmitted={groupedSubmitted}
      editingPriceId={editingPriceId}
      priceDraft={priceDraft}
      setEditingPriceId={setEditingPriceId}
      setPriceDraft={setPriceDraft}
      onStartAdding={startAdding}
      onUpdateDraft={updateDraft}
      onFixAll={fixAll}
      onEditItem={editItem}
      onRemoveItem={removeItem}
      onSavePrice={savePrice}
    />
  );
};

export default DesignMaterials;
