import styles from './CatalogImport.module.css';

const CatalogImportView = ({
  brand,
  collection,
  loading,
  message,

  onBrandChange,
  onCollectionChange,
  onTechZipChange,
  onImagesZipChange,
  onSubmit,
}) => {
  return (
    <div className={styles.wrapper}>
      <h2>Catalog import</h2>

      <form onSubmit={onSubmit} className={styles.form}>
        <label>
          Brand
          <select value={brand} onChange={onBrandChange}>
            <option value="Davis">Davis</option>
            <option value="Fargotex" disabled>
              Fargotex (soon)
            </option>
            <option value="Nevotex" disabled>
              Nevotex (soon)
            </option>
          </select>
        </label>

        <label>
          Collection name
          <input
            value={collection}
            onChange={onCollectionChange}
            placeholder="Adventure"
            required
          />
        </label>

        <label>
          Technical card (ZIP)
          <input
            type="file"
            accept=".zip"
            onChange={onTechZipChange}
            required
          />
        </label>

        <label>
          Images (ZIP)
          <input
            type="file"
            accept=".zip"
            onChange={onImagesZipChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Importing...' : 'Import catalog'}
        </button>

        {message && (
          <p className={styles.message}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CatalogImportView;
