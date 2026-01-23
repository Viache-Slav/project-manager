
import { useEffect, useState } from 'react';
import axios from '../../../api/axios';
import DesignActionsView from './DesignActionsView';

const DesignActions = ({
  item,
  designItemId,
  status,
  materials,
  fabrics,
  designerComment,
  setDesignerComment,
  onUpdated,
}) => {
  const [user, setUser] = useState(null);
  const [salePriceDraft, setSalePriceDraft] = useState('');

  useEffect(() => {
    axios.get('/auth/user').then((res) => setUser(res.data));
  }, []);

  useEffect(() => {
    if (user?.role === 'admin' && status === 'approved') {
      const v = item?.salePrice;
      setSalePriceDraft(
        typeof v === 'number' ? String(v) : ''
      );
    }
  }, [user, status, item?.salePrice]);

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isSubmitted = status === 'submitted';

  const normalizeMaterials = () =>
    (materials || [])
      .filter(
        (m) =>
          m.materialId &&
          Number(m.quantity) > 0 &&
          m.unit
      )
      .map((m) => ({
        material: m.materialId,
        amount: Number(m.quantity),
        unit: m.unit,
      }));

  const normalizeFabrics = () =>
    (fabrics || [])
      .filter(
        (f) =>
          f &&
          String(f.brand || '').trim() &&
          String(f.collectionName || '').trim() &&
          Number(f.meterage) > 0
      )
      .map((f) => ({
        brand: String(f.brand).trim(),
        collectionName: String(f.collectionName).trim(),
        meterage: Number(f.meterage),
      }));

  const save = async () => {
    const payload = normalizeMaterials();
    const fabricsPayload = normalizeFabrics();

    if (!payload.length) {
      alert('Add at least one material with quantity');
      return;
    }

    await axios.post(
      `/design-items/${designItemId}/calculation`,
      {
        materials: payload,
        fabrics: fabricsPayload,
        comment: designerComment,
        mode: 'save',
      }
    );

    onUpdated?.();
  };

  const submit = async () => {
    const payload = normalizeMaterials();
    
    if (!payload.length) {
      alert('Add at least one material with quantity');
      return;
    }

    await axios.post(
      `/design-items/${designItemId}/calculation`,
      {
        materials: payload,
        comment: designerComment,
        mode: 'send',
      }
    );

    onUpdated?.();
  };

  const returnToSubmitted = async () => {
    await axios.post(
      `/design-items/${designItemId}/return`
    );

    onUpdated?.();
  };

  const approve = async () => {
    await axios.post(
      `/design-items/${designItemId}/approve`
    );

    onUpdated?.();
  };

  const saveSalePrice = async () => {
    const num = Number(salePriceDraft);

    if (!Number.isFinite(num) || num <= 0) {
      alert('Invalid sale price');
      return;
    }

    await axios.put(
      `/design-items/${designItemId}/sale-price`,
      { salePrice: num }
    );

    onUpdated?.();
  };

  const actions = {
    save: !isAdmin && isSubmitted ? save : null,
    submit: isSubmitted ? submit : null,
    return:
      isAdmin && ['to_approve', 'approved'].includes(status)
        ? returnToSubmitted
        : null,
    approve:
      isAdmin && status === 'to_approve'
        ? approve
        : null,
  };

  return (
    <DesignActionsView
      isAdmin={isAdmin}
      isSubmitted={isSubmitted}
      status={status}
      salePriceDraft={salePriceDraft}
      onSalePriceChange={(e) =>
        setSalePriceDraft(e.target.value)
      }
      onSaveSalePrice={saveSalePrice}
      designerComment={designerComment}
      onCommentChange={(e) =>
        setDesignerComment(e.target.value)
      }
      actions={actions}
    />
  );
};

export default DesignActions;
