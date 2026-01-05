import styles from './designExpenses.module.css';

const DesignExpenses = ({
  expenses,
  isAdmin,
  expensesCost,
  onEdit,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        Additional expenses
      </div>

      {expenses.length === 0 && (
        <div className={styles.empty}>
          No additional expenses yet
        </div>
      )}

      {expenses.map((e, idx) => (
        <div key={idx} className={styles.item}>
          <div className={styles.name}>
            {e.title}
          </div>

          <div className={styles.line}>
            {e.amount} {e.unit || ''}
            {isAdmin && (
              <> × {e.price} zł = {e.total} zł</>
            )}
          </div>
        </div>
      ))}

      {isAdmin && (
        <>
          <div className={styles.summary}>
            Expenses cost: {expensesCost} zł
          </div>

          <button
            className={styles.button}
            onClick={onEdit}
          >
            Edit expenses
          </button>
        </>
      )}
    </div>
  );
};

export default DesignExpenses;
