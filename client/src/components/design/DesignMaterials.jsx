import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import MaterialRow from './MaterialRow';
import styles from './designMaterials.module.css';

const DesignMaterials = ({ status, rows, setRows }) => {
  const [materials, setMaterials] = useState([]);
  const disabled = status !== 'submitted';

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    const { data } = await axios.get('/materials');
    setMaterials(data);
  };

  const addRow = () => {
    setRows((p) => [...p, { material: '', quantity: '', unit: 'pcs' }]);
  };

  const updateRow = (index, updated) => {
    setRows((p) => p.map((row, i) => (i === index ? updated : row)));
  };

  const removeRow = (index) => {
    setRows((p) => p.filter((_, i) => i !== index));
  };

  return (
    <section className={styles.wrapper}>
      <h3>Расчёт материалов</h3>

      {rows.map((row, i) => (
        <MaterialRow
          key={i}
          row={row}
          materials={materials}
          disabled={disabled}
          onChange={(updated) => updateRow(i, updated)}
          onRemove={() => removeRow(i)}
        />
      ))}

      {!disabled && (
        <button type="button" onClick={addRow} className={styles.add}>
          + Добавить материал
        </button>
      )}
    </section>
  );
};

export default DesignMaterials;
