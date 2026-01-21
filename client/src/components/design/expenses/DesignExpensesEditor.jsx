
import { useState } from 'react';
import axios from '../../../api/axios';
import DesignExpensesEditorView from './DesignExpensesEditorView';

const emptyExpense = () => ({
  type: 'labor',
  title: '',
  amount: 1,
  unit: '',
  price: '',
});

const DesignExpensesEditor = ({
  designItemId,
  expenses = [],
  onSaved,
}) => {
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
    setList((prev) =>
      prev.filter((_, i) => i !== idx)
    );
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

  const updateDraft = (patch) => {
    setDraft((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  return (
    <DesignExpensesEditorView
      list={list}
      draft={draft}
      saving={saving}
      onRemove={removeExpense}
      onDraftChange={updateDraft}
      onAdd={addExpense}
      onSave={saveAll}
    />
  );
};

export default DesignExpensesEditor;
