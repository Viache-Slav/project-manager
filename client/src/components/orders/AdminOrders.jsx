import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import AdminOrdersView from './AdminOrdersView';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminOrdersView
      loading={loading}
      orders={orders}
    />
  );
};

export default AdminOrders;
