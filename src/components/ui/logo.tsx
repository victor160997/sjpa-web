
import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-white p-2 rounded-full">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="text-ong-primary"
        >
          <circle cx="50" cy="50" r="48" stroke="#60C3B1" strokeWidth="4" fill="white"/>
          <path 
            d="M65 25C65 25 55 35 50 45C45 35 35 25 35 25C25 35 25 55 35 65C45 75 50 65 50 65C50 65 55 75 65 65C75 55 75 35 65 25Z" 
            fill="#60C3B1"
          />
          <circle cx="40" cy="45" r="5" fill="white"/>
          <circle cx="60" cy="45" r="5" fill="white"/>
        </svg>
      </div>
    </div>
  );
};
