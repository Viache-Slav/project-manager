import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './designActions.module.css';

const DesignActions = ({
  item,
  designItemId,
  status,
  materials,
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

  const isAdmin = user?.role === 'admin';
  const isSubmitted = status === 'submitted';

  const canSave = !isAdmin && isSubmitted;
  const canSendToApprove = isSubmitted;
  const canApprove = isAdmin && status === 'to_approve';
  const canReturn = isAdmin && (status === 'to_approve' || status === 'approved');

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

  const save = async () => {
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
        mode: 'save',
      }
    );

    alert('Saved');
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

    alert('Sent to approve');
    onUpdated?.();
  };

  const returnToSubmitted = async () => {
    await axios.post(
      `/design-items/${designItemId}/return`
    );

    alert('Returned to recalculation');
    onUpdated?.();
  };

  const approve = async () => {
    await axios.post(
      `/design-items/${designItemId}/approve`
    );

    alert('Approved');
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

    alert('Sale price saved');
    onUpdated?.();
  };

  if (!user) return null;

  return (
    <div className={styles.wrapper}>
      {isAdmin && status === 'approved' && (
        <div className={styles.salePrice}>
          <h4>Sale price</h4>

          <input
            type="number"
            step="0.01"
            value={salePriceDraft}
            onChange={(e) => setSalePriceDraft(e.target.value)}
            placeholder="Sale price"
          />

          <div style={{ marginTop: 8 }}>
            <button onClick={saveSalePrice}>
              Save price
            </button>
          </div>
        </div>
      )}
      
      {isSubmitted && !isAdmin && (
        <>
          <h4>Comment</h4>
          <textarea
            value={designerComment}
            onChange={(e) =>
              setDesignerComment(e.target.value)
            }
            placeholder="Comment"
          />
        </>
      )}

      <div className={styles.actions}>
        {canSave && (
          <button onClick={save}>
            Save
          </button>
        )}

        {canSendToApprove && (
          <button onClick={submit}>
            Send to approve
          </button>
        )}

        {canReturn && (
          <button onClick={returnToSubmitted}>
            Send to recalculation
          </button>
        )}

        {canApprove && (
          <button onClick={approve}>
            Approve
          </button>
        )}
      </div>
    </div>
  );
};

export default DesignActions;
