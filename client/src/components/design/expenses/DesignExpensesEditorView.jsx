const DesignExpensesEditorView = ({
  list,
  draft,
  saving,

  onRemove,
  onDraftChange,
  onAdd,
  onSave,
}) => {
  return (
    <div>
      <h4>Add expenses</h4>

      {list.map((e, i) => (
        <div key={i}>
          <strong>{e.title}</strong>
          <span>
            {' '}— {e.amount} {e.unit || ''}
            {' '}× {e.price} zł
          </span>
          <button onClick={() => onRemove(i)}>
            ✕
          </button>
        </div>
      ))}

      <hr />

      <div>
        <select
          value={draft.type}
          onChange={(e) =>
            onDraftChange({ type: e.target.value })
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
            onDraftChange({ title: e.target.value })
          }
        />

        <input
          type="number"
          min="1"
          value={draft.amount}
          onChange={(e) =>
            onDraftChange({ amount: e.target.value })
          }
        />

        <input
          placeholder="Unit"
          value={draft.unit}
          onChange={(e) =>
            onDraftChange({ unit: e.target.value })
          }
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={draft.price}
          onChange={(e) =>
            onDraftChange({ price: e.target.value })
          }
        />

        <button onClick={onAdd}>
          + Add
        </button>
      </div>

      <button disabled={saving} onClick={onSave}>
        Save expenses
      </button>
    </div>
  );
};

export default DesignExpensesEditorView;
