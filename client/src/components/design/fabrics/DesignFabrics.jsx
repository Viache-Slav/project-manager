import { useEffect, useMemo, useState } from 'react';
import axios from '../../../api/axios';
import DesignFabricsView from './DesignFabricsView';

const DesignFabrics = ({ status, fabrics, setFabrics }) => {
  const disabled = status !== 'submitted';

  const [allFabrics, setAllFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [draft, setDraft] = useState({
    brand: 'Davis',
    collectionName: '',
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
      if (!row.brand || !Array.isArray(row.collections))
        continue;

      map[row.brand] ||= [];

      for (const c of row.collections) {
        if (!c?.name) continue;

        if (
          !map[row.brand].some(
            (x) => x.name === c.name
          )
        ) {
          map[row.brand].push({
            name: c.name,
            pricePerMeter: c.pricePerMeter ?? 0,
          });
        }
      }
    }

    return map;
  }, [allFabrics]);

  const brands = useMemo(
    () => Object.keys(collectionsByBrand),
    [collectionsByBrand]
  );

  const collections = useMemo(
    () => collectionsByBrand[draft.brand] || [],
    [collectionsByBrand, draft.brand]
  );

  const add = () => {
    if (!draft.brand || !draft.collectionName) {
      alert('Select brand and collection');
      return;
    }

    const exists = (fabrics || []).some(
      (x) =>
        x.brand === draft.brand &&
        x.collectionName === draft.collectionName
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
        collectionName: draft.collectionName,
        pricePerMeter:
          Number(draft.pricePerMeter) || 0,
      },
    ]);

    setDraft({
      brand: draft.brand,
      collectionName: '',
      pricePerMeter: 0,
      editingPrice: false,
    });
  };

  const remove = (id) => {
    setFabrics((prev) =>
      (prev || []).filter((x) => x.id !== id)
    );
  };

  const saveRowPrice = async (row) => {
    const value = Number(rowPriceDraft);

    if (!Number.isFinite(value) || value < 0) {
      alert('Invalid price');
      return;
    }

    await axios.put('/fabrics/collection-price', {
      brand: row.brand,
      collectionName: row.collectionName,
      pricePerMeter: value,
    });

    setFabrics((prev) =>
      (prev || []).map((x) =>
        x.id === row.id
          ? { ...x, pricePerMeter: value }
          : x
      )
    );

    setEditingRowId(null);
    setRowPriceDraft('');
  };

  return (
    <DesignFabricsView
      loading={loading}
      disabled={disabled}
      fabrics={fabrics}
      brands={brands}
      collections={collections}
      draft={draft}
      setDraft={setDraft}
      editingRowId={editingRowId}
      rowPriceDraft={rowPriceDraft}
      setEditingRowId={setEditingRowId}
      setRowPriceDraft={setRowPriceDraft}
      onAdd={add}
      onRemove={remove}
      onSaveRowPrice={saveRowPrice}
    />
  );
};

export default DesignFabrics;
