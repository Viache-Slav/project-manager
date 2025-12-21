import { useState } from 'react';
import axios from '../../api/axios';
import styles from './designActions.module.css';

const DesignActions = ({
  designItemId,
  status,
  materialsRows,
  designerComment,
  setDesignerComment,
  onUpdated,
}) => {
  const disabled = status !== 'submitted';

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const normalizeRows = () => {
    return materialsRows
      .map((r) => ({
        material: String(r.material || '').trim(),
        quantity: Number(r.quantity),
        unit: r.unit || 'pcs',
      }))
      .filter((r) => r.material && !Number.isNaN(r.quantity) && r.quantity > 0);
  };

  const submit = async (mode) => {
    setNotice('');

    if (disabled) return;

    const payload = {
      materials: normalizeRows(),
      designerComment: String(designerComment || '').trim(),
      mode, // 'save' | 'send'
    };

    if (payload.materials.length === 0) {
      setNotice('Добавь хотя бы один материал с количеством');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/design-items/${designItemId}/calculation`, payload);

      if (mode === 'save') setNotice('Сохранено');
      if (mode === 'send') setNotice('Отправлено на утверждение');

      if (onUpdated) onUpdated();
    } catch (err) {
      setNotice(
        err?.response?.data?.message ||
          'Ошибка при сохранении'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.wrapper}>
      <h3>Комментарий проектировщика</h3>

      <textarea
        className={styles.textarea}
        value={designerComment}
        onChange={(e) => setDesignerComment(e.target.value)}
        disabled={disabled}
        placeholder="Комментарий, примечания, допущения…"
      />

      {notice && <div className={styles.notice}>{notice}</div>}

      {!disabled && (
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => submit('save')}
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save'}
          </button>

          <button
            type="button"
            onClick={() => submit('send')}
            disabled={loading}
            className={styles.primary}
          >
            {loading ? 'Sending…' : 'Send to approve'}
          </button>
        </div>
      )}

      {disabled && (
        <div className={styles.locked}>
          Статус: {status}. Редактирование отключено.
        </div>
      )}
    </section>
  );
};

export default DesignActions;
