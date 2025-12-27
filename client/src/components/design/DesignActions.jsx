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
  const disabled = status !== 'submitted';

  const normalizeMaterials = () =>
    materials
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
      alert('Добавь хотя бы один материал с количеством');
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
  };

  const submit = async () => {
    const payload = normalizeMaterials();

    if (!payload.length) {
      alert('Добавь хотя бы один материал с количеством');
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
    onUpdated();
  };

  if (disabled) return null;

  return (
    <div className={styles.wrapper}>
      <h4>Comment</h4>

      <textarea
        value={designerComment}
        onChange={(e) =>
          setDesignerComment(e.target.value)
        }
        placeholder="Комментарий дизайнера"
      />

      <div className={styles.actions}>
        <button onClick={save}>Save</button>
        <button onClick={submit}>
          Send to approve
        </button>
      </div>
    </div>
  );
};

export default DesignActions;
