import { useId, useState } from 'react';

const AccordionSection = ({
  title,
  children,
  defaultOpen = false,
  className = '',
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  const rootCls = [
    'rounded-xl overflow-hidden',
    className,
  ].join(' ');

  const btnCls = [
    'group w-full',
    'flex items-center justify-center',
    'py-6',
    'transition-transform duration-100',
    'active:scale-[0.85] active:translate-y-[1px]',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
  ].join(' ');

  const titleCls = [
    'font-semibold',
    'text-2xl',
    'text-amber-950',
    'transition-colors duration-150',
    'group-hover:text-amber-700',
    'drop-shadow-[0_2px_3px_rgba(0,0,0,0.55)]',
  ].join(' ');

  const bodyCls = [
    'px-4 pb-4 pt-2',
  ].join(' ');

  return (
    <div className={rootCls}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={btnCls}
      >
        <span className={titleCls}>{title}</span>
      </button>

      {open && (
        <div id={panelId} className={bodyCls}>
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;