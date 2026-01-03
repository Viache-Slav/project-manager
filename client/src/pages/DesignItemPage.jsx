
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
  const [calculation, setCalculation] = useState(null);

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
          materialId: m.material?._id || '',
          materialName: m.material?.name || '',
          quantity: m.amount,
          unit: m.unit,
          categoryName: m.material?.category?.name || '',
          categoryId: m.material?.category?._id || '',
        }))
      );
    } else {
      setMaterials([]);
    }

    if (data.calculation?.comment) {
      setDesignerComment(data.calculation.comment);
    } else {
      setDesignerComment('');
    }

    if (data.status === 'to_approve' || data.status === 'approved') {
      try {
        const { data: calc } = await axios.get(`/design-items/${id}/calculation`);
        setCalculation(calc);
      } catch (e) {
        setCalculation(null);
      }
    } else {
      setCalculation(null);
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
          calculation={calculation}
          onUpdated={loadItem}
        />

        <DesignActions
          designItemId={id}
          status={item.status}
          materials={materials}
          designerComment={designerComment}
          setDesignerComment={setDesignerComment}
          onUpdated={loadItem}
          calculation={calculation}
        />
      </AccordionSection>
    </>
  );
};

export default DesignItemPage;
