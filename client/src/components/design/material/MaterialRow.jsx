import axios from '../../../api/axios';
import MaterialRowView from './MaterialRowView';

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

  const handleCategoryChange = (name) => {
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
  };

  const handleCreateCategory = async () => {
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
  };

  const handleMaterialChange = (name) => {
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
  };

  const handleCreateMaterial = async () => {
    const { data } = await axios.post(
      '/materials',
      {
        name: row.materialName,
        categoryId: row.categoryId,
      }
    );

    onChange({
      ...row,
      materialId: data._id,
      materialName: data.name,
    });

    window.dispatchEvent(
      new Event('refresh-material-categories')
    );
  };

  return (
    <MaterialRowView
      row={row}
      categories={categories}
      selectedCategory={selectedCategory}
      categoryExists={categoryExists}
      materialExists={materialExists}
      onCategoryChange={handleCategoryChange}
      onCreateCategory={handleCreateCategory}
      onMaterialChange={handleMaterialChange}
      onCreateMaterial={handleCreateMaterial}
      onQuantityChange={(value) =>
        onChange({ ...row, quantity: value })
      }
      onUnitChange={(value) =>
        onChange({ ...row, unit: value })
      }
    />
  );
};

export default MaterialRow;
