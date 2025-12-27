import axios from '../../api/axios';
import styles from './designMaterials.module.css';

const UNITS = ['pcs', 'm', 'm2', 'm3', 'kg'];

const MaterialRow = ({ row, categories, onChange }) => {
  const selectedCategory = categories.find(
    (c) => c._id === row.categoryId
  );

  const categoryExists = categories.some(
    (c) =>
      c.name.toLowerCase() ===
      row.categoryName?.toLowerCase()
  );

  const materialExists =
    selectedCategory?.materials?.some(
      (m) =>
        m.name.toLowerCase() ===
        row.materialName?.toLowerCase()
    );

  return (
    <div className={styles.row}>
      <input
        list="categories"
        value={row.categoryName}
        placeholder="Category"
        onChange={(e) => {
          const name = e.target.value;
          const cat = categories.find(
            (c) => c.name === name
          );

          onChange({
            ...row,
            categoryId: cat?._id || '',
            categoryName: name,
            materialId: '',
            materialName: '',
            quantity: '',
            unit: '',
          });
        }}
      />

      <datalist id="categories">
        {categories.map((c) => (
          <option key={c._id} value={c.name} />
        ))}
      </datalist>

      {row.categoryName &&
        !categoryExists && (
          <button
            type="button"
            className={styles.create}
            onClick={async () => {
              const { data } = await axios.post(
                '/material-categories',
                { name: row.categoryName }
              );

              onChange({
                ...row,
                categoryId: data._id,
                categoryName: data.name,
              });

              window.dispatchEvent(
                new Event('refresh-material-categories')
              );
            }}
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
            onChange={(e) => {
              const name = e.target.value;
              const m =
                selectedCategory.materials.find(
                  (x) => x.name === name
                );

              onChange({
                ...row,
                materialId: m?._id || '',
                materialName: name,
                quantity: '',
                unit: '',
              });
            }}
          />

          <datalist id="materials">
            {selectedCategory.materials.map(
              (m) => (
                <option
                  key={m._id}
                  value={m.name}
                />
              )
            )}
          </datalist>

          {row.materialName &&
            !materialExists && (
              <button
                type="button"
                className={styles.create}
                onClick={async () => {
                  const { data } =
                    await axios.post(
                      '/materials',
                      {
                        name: row.materialName,
                        unit: row.unit || 'pcs',
                        categoryId: row.categoryId,
                      }
                    );

                  onChange({
                    ...row,
                    materialId: data._id,
                    materialName: data.name,
                  });

                  window.dispatchEvent(
                    new Event(
                      'refresh-material-categories'
                    )
                  );
                }}
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
            onChange({
              ...row,
              quantity: e.target.value,
            })
          }
        />
      )}

      {row.materialId && row.quantity && (
        <select
          value={row.unit}
          onChange={(e) =>
            onChange({
              ...row,
              unit: e.target.value,
            })
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

export default MaterialRow;
