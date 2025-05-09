import React from 'react';
import Topbar from '../../components/DashboardComposent/Topbar';
import UserTable from '../../components/User/UserTable';
import './dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Topbar />
      <div className="dashboard-content">
        <UserTable />
      </div>
    </div>
  );
}




