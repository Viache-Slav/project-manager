
import { useEffect, useMemo, useState } from 'react';
import axios from '../../../api/axios';
import DesignFabricsView from './DesignFabricsView';

const norm = (v) => String(v || '').trim().toLowerCase();

const getPriceFromMeta = (allFabrics, brand, collectionName) =>
  allFabrics
    .find((b) => norm(b.brand) === norm(brand))
    ?.collections.find(
      (c) => norm(c.name) === norm(collectionName)
    )
    ?.pricePerMeter ?? null;

const DesignFabrics = ({ status, fabrics, setFabrics, designItemId }) => {
  const disabled = status !== 'submitted';

  const [allFabrics, setAllFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [draft, setDraft] = useState({
    brand: 'Davis',
    collectionName: '',
    meterage: '',
  });

  const [editingRowId, setEditingRowId] = useState(null);
  const [rowPriceDraft, setRowPriceDraft] = useState('');

  useEffect(() => {
    axios
      .get('/fabrics/meta')
      .then((res) => setAllFabrics(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!designItemId) return;

    axios.get(`/design-items/${designItemId}`).then((res) => {
      const collections =
        res.data?.fabricSelection?.collections || [];

      setFabrics(
        collections.map((c) => ({
          id: c._id || crypto.randomUUID(),
          brand: c.brand,
          collectionName: c.collectionName,
          meterage: Number(c.meterage) || 0,
        }))
      );
    });
  }, [designItemId, setFabrics]);

  const getPrice = (brand, collectionName) =>
    getPriceFromMeta(allFabrics, brand, collectionName);

  const collectionsByBrand = useMemo(() => {
    const map = {};

    for (const row of allFabrics) {
      if (!row.brand || !Array.isArray(row.collections)) continue;

      map[row.brand] ||= [];

      for (const c of row.collections) {
        if (!c?.name) continue;

        if (!map[row.brand].some((x) => x.name === c.name)) {
          map[row.brand].push({
            name: c.name,
            pricePerMeter: c.pricePerMeter ?? null,
          });
        }
      }
    }

    return map;
  }, [allFabrics]);

  const brands = Object.keys(collectionsByBrand);
  const collections = collectionsByBrand[draft.brand] || [];

  const persistFabrics = async (next) => {
    if (!designItemId) return;

    await axios.put(`/design-items/${designItemId}/fabrics`, {
      fabrics: next.map((f) => ({
        brand: f.brand,
        collectionName: f.collectionName,
        meterage: Number(f.meterage),
      })),
    });
  };

  const add = async () => {
    if (!draft.brand || !draft.collectionName) return;
    if (!draft.meterage || Number(draft.meterage) <= 0) return;

    const exists = fabrics.some(
      (f) =>
        f.brand === draft.brand &&
        f.collectionName === draft.collectionName
    );

    if (exists) return;

    const next = [
      ...fabrics,
      {
        id: crypto.randomUUID(),
        brand: draft.brand,
        collectionName: draft.collectionName,
        meterage: Number(draft.meterage),
      },
    ];

    setFabrics(next);
    await persistFabrics(next);

    setDraft({
      brand: draft.brand,
      collectionName: '',
      meterage: '',
    });
  };

  const remove = async (id) => {
    const next = fabrics.filter((f) => f.id !== id);
    setFabrics(next);
    await persistFabrics(next);
  };

  const saveRowPrice = async (row) => {
    const value = Number(rowPriceDraft);
    if (!Number.isFinite(value) || value < 0) return;

    await axios.put('/fabrics/collection-price', {
      brand: row.brand,
      collectionName: row.collectionName,
      pricePerMeter: value,
    });

    const res = await axios.get('/fabrics/meta');
    setAllFabrics(res.data);

    setEditingRowId(null);
    setRowPriceDraft('');
  };

  const fabricsWithTotal = useMemo(() => {
    if (!allFabrics.length) return fabrics;

    return fabrics.map((f) => {
      const price = getPrice(f.brand, f.collectionName);

      return {
        ...f,
        price: typeof price === 'number' ? price : null,
        total:
          typeof price === 'number'
            ? price * f.meterage
            : null,
      };
    });
  }, [fabrics, allFabrics]);

  return (
    <DesignFabricsView
      loading={loading}
      disabled={disabled}
      fabrics={fabricsWithTotal}
      brands={brands}
      collections={collections}
      draft={draft}
      editingRowId={editingRowId}
      rowPriceDraft={rowPriceDraft}
      getPrice={getPrice}
      setDraft={setDraft}
      setEditingRowId={setEditingRowId}
      setRowPriceDraft={setRowPriceDraft}
      onAdd={add}
      onRemove={remove}
      onSaveRowPrice={saveRowPrice}
    />
  );
};

export default DesignFabrics;
