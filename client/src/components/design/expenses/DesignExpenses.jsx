
import DesignExpensesView from './DesignExpensesView';

const DesignExpenses = ({
  expenses = [],
  isAdmin,
  expensesCost = 0,
  onEdit,
}) => {
  return (
    <DesignExpensesView
      expenses={expenses}
      isAdmin={isAdmin}
      expensesCost={expensesCost}
      onEdit={onEdit}
    />
  );
};

export default DesignExpenses;
