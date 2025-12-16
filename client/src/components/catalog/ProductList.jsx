import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import ProductCard from './ProductCard';
import ProductEditModal from './ProductEditModal';

const ProductList = ({ user, onReady }) => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadProducts();
    if (onReady) {
      onReady(loadProducts);
    }
  }, []);

  const loadProducts = async () => {
    const { data } = await axios.get('/products');
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete product?')) return;
    await axios.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <>
      <h2>Catalog</h2>

      <div className="grid">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            isAdmin={isAdmin}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {editing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999
          }}
        >
          <ProductEditModal
            product={editing}
            onClose={() => setEditing(null)}
            onSaved={loadProducts}
          />
        </div>
      )}
    </>
  );
};

export default ProductList;
