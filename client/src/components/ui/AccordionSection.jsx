import { useState } from 'react';

const AccordionSection = ({ title, children, defaultOpen = false, className = '' }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
      >
        <span className="font-semibold text-left">{title}</span>
        <span className="text-white/70">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;
