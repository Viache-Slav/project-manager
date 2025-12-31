import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styles from './materialsOverview.module.css';

const MaterialsOverview = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/materials')
      .then((res) => setMaterials(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading materials...</p>;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Materials</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Unit</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {materials.map((m) => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.category?.name || '—'}</td>
              <td>{m.unit}</td>
              <td>{m.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialsOverview;
