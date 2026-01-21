
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import DesignCatalogView from './DesignCatalogView';

const DesignCatalog = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const navigate = useNavigate();

  const isAdmin = true;

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data } = await axios.get('/design-items');
    setItems(data);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;

    await axios.delete(`/design-items/${id}`);
    loadItems();
  };

  return (
    <DesignCatalogView
      items={items}
      isAdmin={isAdmin}
      onOpenItem={(id) =>
        navigate(`/design-items/${id}`)
      }
      onEdit={(item) =>
        setEditingItem(item)
      }
      onDelete={handleDelete}
      editingItem={editingItem}
      onSaved={() => {
        setEditingItem(null);
        loadItems();
      }}
      onCancelEdit={() =>
        setEditingItem(null)
      }
    />
  );
};

export default DesignCatalog;
