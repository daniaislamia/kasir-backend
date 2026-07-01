// src/components/Layout/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  Dashboard, 
  Inventory, 
  Receipt, 
  People, 
  LocalOffer,
  Logout 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/products', label: 'Produk', icon: <Inventory /> },
    { path: '/transactions', label: 'Transaksi', icon: <Receipt /> },
    { path: '/members', label: 'Member', icon: <People /> },
    { path: '/promos', label: 'Promo', icon: <LocalOffer /> },
  ];

  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: '250px', position: 'fixed' }}>
      <h4 className="mb-4">🧾 Kasir App</h4>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link 
            key={item.path}
            as={Link} 
            to={item.path}
            className={`text-white mb-2 ${location.pathname === item.path ? 'bg-primary rounded' : ''}`}
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}
        <Nav.Link onClick={logout} className="text-white mt-5">
          <Logout className="me-2" /> Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;