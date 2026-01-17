import React from 'react';

function PatchCable({ from, to, color, onClick, temporary }) {
  // Calculate cable path using bezier curves for a natural cable look
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  // Control points for bezier curve (creates a natural sagging cable effect)
  const sag = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3 + 50;
  
  const controlPoint1X = from.x + dx * 0.3;
  const controlPoint1Y = from.y + sag;
  const controlPoint2X = to.x - dx * 0.3;
  const controlPoint2Y = to.y + sag;

  const path = `M ${from.x} ${from.y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${to.x} ${to.y}`;

  return (
    <g 
      className={`patch-cable ${temporary ? 'temporary' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Cable shadow for depth */}
      <path
        d={path}
        stroke="#000000"
        strokeWidth="6"
        fill="none"
        opacity="0.3"
        transform="translate(2, 2)"
      />
      
      {/* Main cable */}
      <path
        d={path}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={temporary ? "8,4" : "none"}
        style={{ pointerEvents: 'stroke' }}
      />
      
      {/* Cable highlight for 3D effect */}
      <path
        d={path}
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        style={{ pointerEvents: 'none' }}
      />

      {/* Connection points with plug appearance */}
      <g className="cable-plug">
        {/* From plug */}
        <circle cx={from.x} cy={from.y} r="6" fill="#222" stroke="#000" strokeWidth="1" />
        <circle cx={from.x} cy={from.y} r="4" fill={color} stroke={color} strokeWidth="1" />
        <circle cx={from.x} cy={from.y} r="2" fill="rgba(255, 255, 255, 0.3)" />
        
        {/* To plug */}
        <circle cx={to.x} cy={to.y} r="6" fill="#222" stroke="#000" strokeWidth="1" />
        <circle cx={to.x} cy={to.y} r="4" fill={color} stroke={color} strokeWidth="1" />
        <circle cx={to.x} cy={to.y} r="2" fill="rgba(255, 255, 255, 0.3)" />
      </g>
    </g>
  );
}

export default PatchCable;
