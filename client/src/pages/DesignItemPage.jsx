
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

import DesignInfo from '../components/design/DesignInfo';
import DesignMaterials from '../components/design/DesignMaterials';
import DesignActions from '../components/design/DesignActions';
import AccordionSection from '../components/ui/AccordionSection';

const DesignItemPage = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [designerComment, setDesignerComment] = useState('');

  useEffect(() => {
    loadItem();
  }, []);

  const loadItem = async () => {
    const { data } = await axios.get(`/design-items/${id}`);
    setItem(data);

    if (data.calculation?.materials) {
      setMaterials(
        data.calculation.materials.map((m) => ({
          id: crypto.randomUUID(),
          materialId: m.material,
          materialName: m.materialName || '',
          quantity: m.amount,
          unit: m.unit,
          categoryName: m.categoryName || '',
          categoryId: m.categoryId || '',
        }))
      );
    }

    if (data.calculation?.comment) {
      setDesignerComment(data.calculation.comment);
    }
  };

  if (!item) return null;

  return (
    <>
      <AccordionSection title="Основная информация" defaultOpen>
        <DesignInfo item={item} />
      </AccordionSection>

      <AccordionSection title="Расчёт материалов">
        <DesignMaterials
          status={item.status}
          materials={materials}
          setMaterials={setMaterials}
        />

        <DesignActions
          designItemId={id}
          status={item.status}
          materials={materials}
          designerComment={designerComment}
          setDesignerComment={setDesignerComment}
          onUpdated={loadItem}
        />
      </AccordionSection>
    </>
  );
};

export default DesignItemPage;
