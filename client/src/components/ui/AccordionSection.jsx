import { useState } from 'react';

const AccordionSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: 'pointer',
          padding: '12px 16px',
          background: '#1e1e1e',
          borderRadius: '10px',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{title}</span>
        <span>{open ? '−' : '+'}</span>
      </div>

      {open && (
        <div style={{ marginTop: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;
