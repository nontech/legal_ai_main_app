import React from 'react';

export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 1100 800" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-lg mx-auto">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur"/>
          <feOffset dx="0" dy="10" result="offsetBlur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="offsetBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g fill="none" fillRule="evenodd">
        {/* Background Elements */}
        <circle cx="550" cy="400" r="300" fill="#fcfdff" />
        <path d="M750 200l30 30-30 30" stroke="#f3ae3d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
        <circle cx="300" cy="600" r="20" fill="#23c4b4" opacity="0.4"/>
        
        {/* Central House Composition */}
        <g transform="translate(300 200)" filter="url(#shadow)">
          
          {/* House Structure */}
          {/* Main Body */}
          <rect x="100" y="150" width="300" height="250" rx="10" fill="#ffffff" stroke="#1c4471" strokeWidth="4"/>
          
          {/* Roof */}
          <path d="M50 170 L250 50 L450 170" fill="#ffffff" stroke="#1c4471" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/>
          
          {/* Door */}
          <rect x="220" y="280" width="60" height="120" rx="2" fill="#d4e1f3" stroke="#1c4471" strokeWidth="3"/>
          
          {/* Window */}
          <rect x="150" y="200" width="60" height="60" rx="2" fill="#d4e1f3" stroke="#1c4471" strokeWidth="3"/>
          <path d="M150 230 h60 M180 200 v60" stroke="#1c4471" strokeWidth="2"/>
          
          {/* Document / Analysis Checklist Overlay */}
          <g transform="translate(280 100)">
            <rect x="0" y="0" width="160" height="220" rx="5" fill="#ffffff" stroke="#245588" strokeWidth="3"/>
            
            {/* Document Header */}
            <rect x="20" y="20" width="120" height="20" rx="2" fill="#245588"/>
            
            {/* Lines */}
            <path d="M30 60 h100 M30 90 h100 M30 120 h100 M30 150 h100" stroke="#9ca6b6" strokeWidth="3" strokeLinecap="round"/>
            
            {/* Checkmark Stamp */}
            <circle cx="120" cy="180" r="30" fill="#23c4b4"/>
            <path d="M105 180 l10 10 l20 -20" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          
          {/* Magnifying Glass / Search */}
          <g transform="translate(80 250) rotate(-15)">
            <circle cx="40" cy="40" r="40" fill="#f3ae3d" opacity="0.2" stroke="#f3ae3d" strokeWidth="4"/>
            <line x1="70" y1="70" x2="100" y2="100" stroke="#f3ae3d" strokeWidth="8" strokeLinecap="round"/>
          </g>

        </g>
      </g>
    </svg>
  );
}
