import { useEffect, useRef, useState } from 'react';

const wrapperCls = (className) =>
  `relative ${className}`;

const triggerCls =
  'w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-center text-sm shadow-sm text-white/90 hover:bg-white/15 hover:shadow-md focus:border-white/25 transition-all';

const dropdownCls =
  'absolute left-0 right-0 overflow-hidden rounded-lg bg-gray-500';

const listCls =
  'max-h-56 overflow-auto p-0.5';

const optionBaseCls =
  'w-full px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10';

const optionActiveCls =
  'bg-white/10';

const CollectionDropdown = ({
  className = '',
  options,
  selectedValue,
  selectedLabel,
  onPick,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocPointerDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', onDocPointerDown);
    return () =>
      document.removeEventListener('pointerdown', onDocPointerDown);
  }, []);

  return (
    <div className={wrapperCls(className)} ref={ref}>
      <button
        type="button"
        className={triggerCls}
        onClick={() => setOpen((v) => !v)}
      >
        {selectedLabel}
      </button>

      {open && (
        <div className={dropdownCls}>
          <div className={listCls}>
            {options.map((o) => {
              const isActive = o.value === selectedValue;

              return (
                <button
                  key={o.value}
                  type="button"
                  className={`${optionBaseCls} ${
                    isActive ? optionActiveCls : ''
                  }`}
                  onClick={() => {
                    setOpen(false);
                    onPick(o.value);
                  }}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionDropdown;