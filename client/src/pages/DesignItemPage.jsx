import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

import DesignInfo from '../components/design/DesignInfo';
import DesignMaterials from '../components/design/DesignMaterials';
import DesignActions from '../components/design/DesignActions';

const DesignItemPage = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);

  const [materialsRows, setMaterialsRows] = useState([]);
  const [designerComment, setDesignerComment] = useState('');

  useEffect(() => {
    loadItem();
  }, []);

  const loadItem = async () => {
    const { data } = await axios.get(`/design-items/${id}`);
    setItem(data);
  };

  if (!item) return null;

  return (
    <>
      <DesignInfo item={item} />

      <DesignMaterials
        status={item.status}
        rows={materialsRows}
        setRows={setMaterialsRows}
      />

      <DesignActions
        designItemId={id}
        status={item.status}
        materialsRows={materialsRows}
        designerComment={designerComment}
        setDesignerComment={setDesignerComment}
        onUpdated={loadItem}
      />
    </>
  );
};

export default DesignItemPage;
