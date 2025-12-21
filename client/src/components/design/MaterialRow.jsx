import styles from './designMaterials.module.css';

const UNITS = ['pcs', 'm', 'm2', 'm3', 'kg'];

const MaterialRow = ({
  row,
  materials,
  disabled,
  onChange,
  onRemove,
}) => {
  return (
    <div className={styles.row}>
      <input
        list="materials"
        value={row.material}
        disabled={disabled}
        onChange={(e) =>
          onChange({ ...row, material: e.target.value })
        }
        placeholder="Материал"
      />

      <datalist id="materials">
        {materials.map((m) => (
          <option key={m._id} value={m.name} />
        ))}
      </datalist>

      <input
        type="number"
        min="0"
        step="any"
        value={row.quantity}
        disabled={disabled}
        onChange={(e) =>
          onChange({ ...row, quantity: e.target.value })
        }
        placeholder="Кол-во"
      />

      <select
        value={row.unit}
        disabled={disabled}
        onChange={(e) =>
          onChange({ ...row, unit: e.target.value })
        }
      >
        {UNITS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className={styles.remove}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default MaterialRow;
