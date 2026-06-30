function Logo({ size = 32 }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer rounded square */}
        <rect x="4" y="4" width="92" height="92" rx="22" stroke="#3B82F6" strokeWidth="8" fill="none"/>
  
        {/* Left tall column */}
        <rect x="14" y="28" width="32" height="58" rx="8" fill="white"/>
        {/* Left small square */}
        <rect x="20" y="14" width="16" height="16" rx="4" fill="#3B82F6"/>
  
        {/* Right top square */}
        <rect x="54" y="14" width="32" height="32" rx="8" fill="#93C5FD"/>
        {/* Right bottom column */}
        <rect x="54" y="54" width="32" height="32" rx="8" fill="white"/>
      </svg>
    )
  }
  
  export default Logo