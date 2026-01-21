import styles from './designActions.module.css';

const DesignActionsView = ({
  isAdmin,
  isSubmitted,
  status,

  salePriceDraft,
  onSalePriceChange,
  onSaveSalePrice,

  designerComment,
  onCommentChange,

  actions,
}) => {
  return (
    <div className={styles.wrapper}>
      {isAdmin && status === 'approved' && (
        <div className={styles.salePrice}>
          <h4>Sale price</h4>

          <input
            type="number"
            step="0.01"
            value={salePriceDraft}
            onChange={onSalePriceChange}
            placeholder="Sale price"
          />

          <div style={{ marginTop: 8 }}>
            <button onClick={onSaveSalePrice}>
              Save price
            </button>
          </div>
        </div>
      )}

      {isSubmitted && !isAdmin && (
        <>
          <h4>Comment</h4>
          <textarea
            value={designerComment}
            onChange={onCommentChange}
            placeholder="Comment"
          />
        </>
      )}

      <div className={styles.actions}>
        {actions.save && (
          <button onClick={actions.save}>
            Save
          </button>
        )}

        {actions.submit && (
          <button onClick={actions.submit}>
            Send to approve
          </button>
        )}

        {actions.return && (
          <button onClick={actions.return}>
            Send to recalculation
          </button>
        )}

        {actions.approve && (
          <button onClick={actions.approve}>
            Approve
          </button>
        )}
      </div>
    </div>
  );
};

export default DesignActionsView;
