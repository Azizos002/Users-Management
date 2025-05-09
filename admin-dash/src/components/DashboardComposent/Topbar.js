import React from 'react';
import '../../styles/Topbar.css';
import DarkModeToggle from '../DarkModeToggle';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="logo">🛠️</div>
        <div className="company-name">MyCompany</div>
      </div>
      
      <div className="topbar-right">
        <DarkModeToggle />
        <span className="admin-name">Welcome, Admin</span>
        <img src="https://i.pravatar.cc/40" alt="admin" className="admin-avatar" />
      </div>
    </div>
  );
}


