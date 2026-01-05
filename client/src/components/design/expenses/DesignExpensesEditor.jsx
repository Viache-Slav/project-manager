import { useState } from 'react';
import axios from '../../../api/axios';

const emptyExpense = () => ({
  type: 'labor',
  title: '',
  amount: 1,
  unit: '',
  price: '',
});

const DesignExpensesEditor = ({ designItemId, expenses = [], onSaved }) => {
  const [list, setList] = useState(expenses);
  const [draft, setDraft] = useState(emptyExpense());
  const [saving, setSaving] = useState(false);

  const addExpense = () => {
    if (!draft.title || !draft.price) return;

    setList((prev) => [
      ...prev,
      {
        ...draft,
        amount: Number(draft.amount || 1),
        price: Number(draft.price),
      },
    ]);

    setDraft(emptyExpense());
  };

  const removeExpense = (idx) => {
    setList((prev) => prev.filter((_, i) => i !== idx));
  };

  const saveAll = async () => {
    try {
      setSaving(true);
      await axios.put(
        `/design-items/${designItemId}/expenses`,
        list
      );
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h4>Add expenses</h4>

      {list.map((e, i) => (
        <div key={i} >
          <strong>{e.title}</strong>
          <span>
            {' '}— {e.amount} {e.unit || ''}
            {' '}× {e.price} zł
          </span>
          <button onClick={() => removeExpense(i)}>
            ✕
          </button>
        </div>
      ))}

      <hr />

      <div>
        <select
          value={draft.type}
          onChange={(e) =>
            setDraft({ ...draft, type: e.target.value })
          }
        >
          <option value="labor">Labor</option>
          <option value="service">Service</option>
          <option value="other">Other</option>
        </select>

        <input
          placeholder="Title"
          value={draft.title}
          onChange={(e) =>
            setDraft({ ...draft, title: e.target.value })
          }
        />

        <input
          type="number"
          min="1"
          value={draft.amount}
          onChange={(e) =>
            setDraft({ ...draft, amount: e.target.value })
          }
        />

        <input
          placeholder="Unit"
          value={draft.unit}
          onChange={(e) =>
            setDraft({ ...draft, unit: e.target.value })
          }
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={draft.price}
          onChange={(e) =>
            setDraft({ ...draft, price: e.target.value })
          }
        />

        <button onClick={addExpense}>
          + Add
        </button>
      </div>

      <button disabled={saving} onClick={saveAll}>
        Save expenses
      </button>
    </div>
  );
};

export default DesignExpensesEditor;
