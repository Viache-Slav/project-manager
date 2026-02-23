const FlowLine = ({
  path,
  color,
  width = 6,
  className = '',
  top = '30%',
}) => {
  return (
    <svg
      className={`absolute left-0 w-[300%] ${className}`}
      style={{ top }}
      viewBox="0 0 2880 320"
      fill="none"
    >
      <path
        d={path}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default FlowLine;
