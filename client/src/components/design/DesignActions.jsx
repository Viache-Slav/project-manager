import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './designActions.module.css';

const DesignActions = ({
  designItemId,
  status,
  materials,
  designerComment,
  setDesignerComment,
  onUpdated,
}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/auth/user').then((res) => setUser(res.data));
  }, []);

  const isAdmin = user?.role === 'admin';
  const isSubmitted = status === 'submitted';

  const canSave = !isAdmin && isSubmitted;
  const canSendToApprove = isSubmitted;
  const canAdminActions = isAdmin && status === 'to_approve';

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

  if (!user) return null;

  return (
    <div className={styles.wrapper}>
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

        {canAdminActions && (
          <>
            <button onClick={returnToSubmitted}>
              Send to recalculation
            </button>

            <button onClick={approve}>
              Approve
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DesignActions;
