import styles from './designInfo.module.css';

const DesignInfo = ({ item }) => {
  const { title, type, images, dimensions, comment } = item;

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      {/* ФОТО */}
      <div className={styles.gallery}>
        {images.map((id) => (
          <img
            key={id}
            src={`${import.meta.env.VITE_API_URL}/files/${id}`}
            alt={title}
            className={styles.image}
          />
        ))}
      </div>

      {/* ТИП */}
      <div className={styles.row}>
        <span className={styles.label}>Тип изделия:</span>
        <span>{type?.name || '—'}</span>
      </div>

      {/* РАЗМЕРЫ */}
      <div className={styles.row}>
        <span className={styles.label}>Размеры:</span>
        <span>
          {dimensions.width} × {dimensions.height}
          {dimensions.depth ? ` × ${dimensions.depth}` : ''}
        </span>
      </div>

      {/* КОММЕНТАРИЙ АДМИНИСТРАТОРА */}
      {comment && (
        <div className={styles.comment}>
          <span className={styles.label}>Комментарий администратора:</span>
          <p>{comment}</p>
        </div>
      )}
    </section>
  );
};

export default DesignInfo;
