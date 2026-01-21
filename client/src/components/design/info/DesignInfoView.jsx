import styles from './designInfo.module.css';

const DesignInfoView = ({
  title,
  type,
  images,
  dimensions,
  comment,
  canDeleteImages,
  onDeleteImage,
}) => {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.gallery}>
        {images.map((id) => (
          <div key={id} className={styles.imageWrapper}>
            <img
              src={`${import.meta.env.VITE_API_URL}/files/${id}`}
              alt={title}
              className={styles.image}
            />

            {canDeleteImages && (
              <button
                className={styles.remove}
                onClick={() => onDeleteImage(id)}
                title="Delete image"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.row}>
        <span className={styles.label}>
          Product type:
        </span>
        <span>{type?.name || '—'}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>
          Dimensions:
        </span>
        <span>
          {dimensions.width} × {dimensions.height}
          {dimensions.depth
            ? ` × ${dimensions.depth}`
            : ''}
        </span>
      </div>

      {comment && (
        <div className={styles.comment}>
          <span className={styles.label}>
            Comment:
          </span>
          <p>{comment}</p>
        </div>
      )}
    </section>
  );
};

export default DesignInfoView;
