import React from 'react';
import { User } from 'lucide-react';
import '../styles/UserIconName.css';

const UserIconName = ({ userName, onClick }) => {
  return (
    <div
      className="user-icon-name-container"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={e => e.key === 'Enter' && onClick()}
    >
      <User className="user-icon-name-icon" />
      <span className="user-icon-name-text">{userName}</span>
    </div>
  );
};

export default UserIconName;
