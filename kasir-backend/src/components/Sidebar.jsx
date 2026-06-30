import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  Inventory,
  Receipt,
  Settings,
  Logout,
  NotificationsActive as NotificationsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/products', label: 'Produk', icon: <Inventory /> },
    { path: '/transactions', label: 'Transaksi', icon: <Receipt /> },
    { path: '/notifications', label: 'Notifikasi', icon: <NotificationsIcon /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');  // ← Redirect ke Landing Page
  };

  return (
    <div 
      className="bg-dark text-white vh-100 p-3" 
      style={{ 
        width: '250px', 
        position: 'fixed', 
        top: 0, 
        left: 0,
        zIndex: 1000,
        overflowY: 'auto'
      }}
    >
      <h4 className="mb-4 text-center" style={{ color: '#f0b90b' }}>
        ☕ Kedai Kopi AIM
      </h4>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`text-white mb-2 ${location.pathname === item.path ? 'bg-primary rounded' : ''}`}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s',
              backgroundColor: location.pathname === item.path ? '#2563eb' : 'transparent'
            }}
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}
        <hr className="text-secondary" />
        <Nav.Link 
          onClick={handleLogout}
          className="text-danger"
          style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer' }}
        >
          <Logout className="me-2" /> Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;