import React from 'react';
import { User } from 'lucide-react';
import '../styles/UserIconSimple.css';

const UserIconSimple = ({ onClick }) => {
  return (
    <div className="user-icon-simple" onClick={onClick} role="button" tabIndex={0} onKeyPress={e => e.key === 'Enter' && onClick()}>
      <User />
    </div>
  );
};

export default UserIconSimple;
