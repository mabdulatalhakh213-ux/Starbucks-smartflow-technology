const StarbucksLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E7A4C" />
          <stop offset="50%" stopColor="#006241" />
          <stop offset="100%" stopColor="#004B32" />
        </linearGradient>
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
        </filter>
      </defs>
      
      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="url(#logoGradient)"
        filter="url(#logoShadow)"
      />
      
      {/* Inner ring */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        opacity="0.3"
      />
      
      {/* Center circle with siren silhouette representation */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.9"
      />
      
      {/* Stylized crown/star */}
      <path
        d="M50 18 L53 28 L63 28 L55 34 L58 44 L50 38 L42 44 L45 34 L37 28 L47 28 Z"
        fill="#fff"
        opacity="0.95"
      />
      
      {/* Simplified siren face representation */}
      <ellipse
        cx="50"
        cy="48"
        rx="12"
        ry="14"
        fill="#fff"
        opacity="0.9"
      />
      
      {/* Wavy lines representing hair/waves */}
      <path
        d="M32 55 Q38 48, 44 55 Q50 62, 56 55 Q62 48, 68 55"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      
      <path
        d="M28 65 Q35 58, 42 65 Q50 72, 58 65 Q65 58, 72 65"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      
      <path
        d="M32 75 Q40 68, 50 75 Q60 68, 68 75"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
};

export default StarbucksLogo;
