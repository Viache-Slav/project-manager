import styles from './designMaterials.module.css';

const UNITS = ['pcs', 'm', 'm2', 'm3', 'kg'];

const MaterialRowView = ({
  row,
  categories,
  selectedCategory,
  categoryExists,
  materialExists,

  onCategoryChange,
  onCreateCategory,
  onMaterialChange,
  onCreateMaterial,
  onQuantityChange,
  onUnitChange,
}) => {
  return (
    <div className={styles.row}>
      <input
        list="categories"
        value={row.categoryName}
        placeholder="Category"
        onChange={(e) =>
          onCategoryChange(e.target.value)
        }
      />

      <datalist id="categories">
        {categories.map((c) => (
          <option key={c._id} value={c.name} />
        ))}
      </datalist>

      {row.categoryName && !categoryExists && (
        <button
          type="button"
          className={styles.create}
          onClick={onCreateCategory}
        >
          + Create category "{row.categoryName}"
        </button>
      )}

      {row.categoryId && selectedCategory && (
        <>
          <input
            list="materials"
            value={row.materialName}
            placeholder="Material"
            onChange={(e) =>
              onMaterialChange(e.target.value)
            }
          />

          <datalist id="materials">
            {selectedCategory.materials.map((m) => (
              <option key={m._id} value={m.name} />
            ))}
          </datalist>

          {row.materialName && !materialExists && (
            <button
              type="button"
              className={styles.create}
              onClick={onCreateMaterial}
            >
              + Create material "{row.materialName}"
            </button>
          )}
        </>
      )}

      {row.materialId && (
        <input
          type="number"
          placeholder="Qty"
          value={row.quantity}
          onChange={(e) =>
            onQuantityChange(e.target.value)
          }
        />
      )}

      {row.materialId && row.quantity && (
        <select
          value={row.unit}
          onChange={(e) =>
            onUnitChange(e.target.value)
          }
        >
          <option value="">Unit</option>
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default MaterialRowView;
