import React from 'react';

interface AppIconProps {
  size?: number;
  color?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ size = 24, color = '#007AFF' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill={color} />
      <path
        d="M12 6v6l4 2"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AppIcon; 