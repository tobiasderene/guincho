// CircularPlusButton.jsx
import React from 'react';
import { Plus } from 'lucide-react';
import '../styles/BotonPlus.css';

const sizeConfig = {
  sm: { button: 'btn-sm', icon: 16 },
  md: { button: 'btn-md', icon: 20 },
  lg: { button: 'btn-lg', icon: 24 },
  xl: { button: 'btn-xl', icon: 28 }
};

const CircularPlusButton = ({ onClick, size = 'lg', disabled = false, isHovered = false, setHovered = () => {} }) => {
  const currentSize = sizeConfig[size];

  return (
    <div className="btn-wrapper">
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`circular-btn ${currentSize.button} ${disabled ? 'disabled' : 'active'}`}
      >
        <div className={`glow-overlay ${isHovered && !disabled ? 'opacity-20' : 'opacity-0'}`} />

        <Plus 
          size={currentSize.icon} 
          color="white" 
          strokeWidth={2.5}
          className={`plus-icon ${isHovered && !disabled ? 'rotate-90' : 'rotate-0'}`}
        />

        <div className="click-ping" />
      </button>
    </div>
  );
};

export default CircularPlusButton;
