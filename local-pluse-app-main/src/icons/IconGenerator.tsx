import React from 'react';
import { AppIcon } from './index';

interface IconGeneratorProps {
  size: number;
  className?: string;
}

const IconGenerator: React.FC<IconGeneratorProps> = ({ size, className }) => {
  return (
    <div className={className}>
      <AppIcon size={size} />
    </div>
  );
};

export default IconGenerator; 