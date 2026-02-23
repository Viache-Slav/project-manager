import LogoIcon from './LogoIcon';

const Logo = ({
  title = 'MEBLEX',
  estd = 'FVO',
  year = '2026',
  className = 'text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors duration-300',
  compact = false,
}) => {
  return (
    <div className="inline-block origin-center cursor-pointer"
      style={{ transform: 'scale(var(--logo-scale))' }}
      >
      <div className={['flex items-center', className].join(' ')}>
        <div className="flex flex-col">
          
            <div className="flex items-center">
              <span className="origin-right scale-[0.5]">
                <span className="block translate-y-10 text-[10px] tracking-[0.12em] opacity-60">
                  {estd}
                </span>
              </span>

              <LogoIcon compact={compact} />

              <span className="inline-block origin-left scale-[0.5]">
                <span className="block translate-y-10 text-[10px] tracking-[0.12em] opacity-60">
                  {year}
                </span>
              </span>
            </div>

          <div className="text-center -mt-1.5">
            <span className="tracking-[0.5em] -mr-[0.3em]">
              {title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
