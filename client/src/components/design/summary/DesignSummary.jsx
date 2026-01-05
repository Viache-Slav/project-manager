import styles from './designSummary.module.css';

const DesignSummary = ({ calculation, status, user }) => {
  if (
    user?.role !== 'admin' ||
    status === 'submitted' ||
    !calculation?.summary?.totalCost
  ) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.total}>
        Total cost: {calculation.summary.totalCost} zł
      </div>
    </div>
  );
};

export default DesignSummary;
