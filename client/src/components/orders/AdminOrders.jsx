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

  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.patch(
        `/orders/${orderId}/status`,
        { status }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? res.data : o
        )
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <AdminOrdersView
      loading={loading}
      orders={orders}
      onStatusChange={updateStatus}
    />
  );
};

export default AdminOrders;
