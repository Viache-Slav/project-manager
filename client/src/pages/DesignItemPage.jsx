import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

import DesignInfo from '../components/design/info/DesignInfo';
import DesignMaterials from '../components/design/material/DesignMaterials';
import DesignActions from '../components/design//action/DesignActions';
import DesignExpensesEditor from '../components/design/expenses/DesignExpensesEditor';
import DesignSummary from '../components/design/summary/DesignSummary';
import DesignExpenses from '../components/design/expenses/DesignExpenses';
import AccordionSection from '../components/ui/AccordionSection';
import DesignFabrics from '../components/design/fabrics/DesignFabrics';

const DesignItemPage = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [designerComment, setDesignerComment] = useState('');
  const [calculation, setCalculation] = useState(null);
  const [user, setUser] = useState(null);
  const [showExpensesEditor, setShowExpensesEditor] = useState(false);

  useEffect(() => {
    axios.get('/auth/user').then(res => setUser(res.data));
  }, []);

  useEffect(() => {
    if (user) { loadItem();}
  }, [user]);

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

    if (data.fabricSelection?.collections) {
      setFabrics(
        data.fabricSelection.collections.map((f) => ({
          id: f._id || crypto.randomUUID(),
          brand: f.brand,
          collectionName: f.collectionName,
          meterage: f.meterage,
        }))
      );
    } else {
      setFabrics([]);
    }

    setDesignerComment(data.calculation?.comment || '');

    if (
      user?.role === 'admin' &&
      (data.status === 'to_approve' || data.status === 'approved')
    ) {
      try {
        const { data: calc } = await axios.get(
          `/design-items/${id}/calculation`
        );
        setCalculation(calc);
      } catch {
        setCalculation(null);
      }
    } else {
      setCalculation(null);
    }
  };

  if (!item) return null;

  return (
    <>
      <AccordionSection title="Basic information" defaultOpen>
        <DesignInfo item={item} />
      </AccordionSection>

      <AccordionSection title="Calculation of materials">
        <DesignMaterials
          status={item.status}
          materials={materials}
          setMaterials={setMaterials}
          calculation={calculation}
          onUpdated={loadItem}
        />

        <DesignFabrics
          status={item.status}
          fabrics={fabrics}
          setFabrics={setFabrics}
          designItemId={id}
        />

        {item.calculation && (
          <DesignExpenses
            expenses={item.calculation.expenses}
            expensesCost={calculation?.summary?.expensesCost}
            isAdmin={user?.role === 'admin'}
            onEdit={() => setShowExpensesEditor(true)}
          />
        )}

        {showExpensesEditor && user?.role === 'admin' && (
          <DesignExpensesEditor
            designItemId={id}
            expenses={item.calculation.expenses}
            onSaved={() => {
              setShowExpensesEditor(false);
              loadItem();
            }}
          />
        )}

        <DesignSummary
          calculation={calculation}
          status={item.status}
          user={user}
        />

        {designerComment && (
          <div style={{ marginTop: 16 }}>
            <strong>Designer comment:</strong>
            <div>{designerComment}</div>
          </div>
        )}

        <DesignActions
          item={item}
          designItemId={id}
          status={item.status}
          materials={materials}
          fabrics={fabrics}  
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
