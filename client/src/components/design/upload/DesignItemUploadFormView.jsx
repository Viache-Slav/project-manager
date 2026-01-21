import styles from './DesignItemUploadForm.module.css';

const DesignItemUploadFormView = ({
  isEdit,
  form,
  loading,
  error,
  success,
  fileInputRef,

  onChange,
  onFiles,
  onSubmit,
  onCancel,
}) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h3>{isEdit ? 'Edit item' : 'New item'}</h3>

      {success && (
        <div className={styles.success}>
          {success}
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <label>
        {isEdit ? 'Add photos' : 'Photos'}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFiles}
          required={!isEdit}
        />
      </label>

      <label>
        Title {isEdit ? '' : '*'}
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          required={!isEdit}
        />
      </label>

      <label>
        Type {isEdit ? '' : '*'}
        <input
          name="type"
          value={form.type}
          onChange={onChange}
          required={!isEdit}
        />
      </label>

      <div className={styles.row}>
        <label>
          Width {isEdit ? '' : '*'}
          <input
            name="width"
            value={form.width}
            onChange={onChange}
            required={!isEdit}
          />
        </label>

        <label>
          Height {isEdit ? '' : '*'}
          <input
            name="height"
            value={form.height}
            onChange={onChange}
            required={!isEdit}
          />
        </label>

        <label>
          Depth
          <input
            name="depth"
            value={form.depth}
            onChange={onChange}
          />
        </label>
      </div>

      <label>
        Comment
        <textarea
          name="comment"
          value={form.comment}
          onChange={onChange}
        />
      </label>

      <div className={styles.actions}>
        <button type="submit" disabled={loading}>
          {loading
            ? 'Saving…'
            : isEdit
            ? 'Save changes'
            : 'Create item'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default DesignItemUploadFormView;
