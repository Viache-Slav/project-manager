import styles from './catalog.module.css';
import placeholder from '../../assets/product-placeholder.png';

const ProductCard = ({ product, isAdmin, onEdit, onDelete }) => {
  const {
    title,
    description,
    article,
    class: productClass,
    image,
    productPrice,
    costPrice,
    margin,
  } = product;

  return (
    <div className={styles.card}>
      <img
        src={image || placeholder}
        alt={title}
        className={styles.image}
      />

      <div className={styles.content}>
        <h3>{title}</h3>

        {description && <p>{description}</p>}

        <div className={styles.meta}>
          <span>Артикул: {article}</span>
          {productClass && <span>Класс: {productClass}</span>}
        </div>

        <div className={styles.prices}>
          <span>Цена: {productPrice} €</span>
          {costPrice !== undefined && (
            <span>Себестоимость: {costPrice} €</span>
          )}
          {margin !== undefined && (
            <span>Маржа: {margin} €</span>
          )}
        </div>

        {isAdmin && (
          <div className={styles.actions}>
            <button onClick={() => onEdit(product)}>Edit</button>
            <button onClick={() => onDelete(product._id)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
