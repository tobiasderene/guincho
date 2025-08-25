const WheelLoader = () => (
  <svg
    className="wheel-loader"
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
  >
    {/* Círculo exterior (llanta) */}
    <circle
      cx="50"
      cy="50"
      r="45"
      stroke="#333"
      strokeWidth="6"
      fill="none"
    />
    
    {/* Círculo interior (centro) */}
    <circle
      cx="50"
      cy="50"
      r="8"
      fill="#333"
    />

    {/* Rayos tipo Borbet */}
    <g stroke="#ff6600" strokeWidth="6" strokeLinecap="round">
      <line x1="50" y1="50" x2="50" y2="15" />
      <line x1="50" y1="50" x2="85" y2="65" />
      <line x1="50" y1="50" x2="15" y2="65" />
      <line x1="50" y1="50" x2="85" y2="35" />
      <line x1="50" y1="50" x2="15" y2="35" />
    </g>
  </svg>
);

export default WheelLoader;
