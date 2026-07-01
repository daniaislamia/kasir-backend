// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Container, Modal, Button } from 'react-bootstrap';
import Sidebar from '../components/Layout/Sidebar';
import StatsCard from '../components/StatsCard';
import { Bar, Line } from 'react-chartjs-2';
import api from '../api/axiosConfig';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProduk: 0,
    totalTransaksi: 0,
    totalUser: 0,
    totalPendapatan: 0,
    totalMembers: 0,
    totalPromos: 0
  });
  const [loading, setLoading] = useState(true);
  const [latestCustomer, setLatestCustomer] = useState('');
  const [topProducts, setTopProducts] = useState([]);
  const [topProfit, setTopProfit] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [user]);

  useEffect(() => {
    window.refreshDashboard = () => {
      console.log('🔄 Refreshing dashboard...');
      setRefreshTrigger(prev => prev + 1);
    };
    return () => {
      delete window.refreshDashboard;
    };
  }, []);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchStats();
    }
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard data...');
      
      const response = await api.get('/dashboard');
      console.log('Dashboard response:', response.data);
      
      setStats({
        totalProduk: response.data.totalProduk || 0,
        totalTransaksi: response.data.totalTransaksi || 0,
        totalUser: response.data.totalUser || 0,
        totalPendapatan: response.data.totalPendapatan || 0,
        totalMembers: 0,
        totalPromos: 0
      });

      const transaksiRes = await api.get('/transaksi');
      const transaksi = transaksiRes.data?.data || transaksiRes.data || [];
      const recent = Array.isArray(transaksi) ? transaksi.slice(-5).reverse() : [];
      
      if (recent.length > 0) {
        setLatestCustomer(recent[0].customer_name || 'Umum');
      }

      await calculateTopProducts();
      
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTopProducts = async () => {
    try {
      console.log('📊 Fetching top products...');
      const response = await api.get('/top-products');
      console.log('🏆 Top products response:', response.data);
      
      if (response.data && response.data.success) {
        setTopProducts(response.data.topRevenue || []);
        setTopProfit(response.data.topProfit || []);
        console.log('✅ Top Revenue:', response.data.topRevenue);
        console.log('✅ Top Profit:', response.data.topProfit);
      } else {
        setTopProducts([]);
        setTopProfit([]);
      }
    } catch (error) {
      console.error('❌ Error fetching top products:', error);
      setTopProducts([]);
      setTopProfit([]);
    }
  };

  const handleReset = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/reset-top-products', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Data Top Revenue & Top Profit berhasil direset!');
        setTopProducts([]);
        setTopProfit([]);
        setShowResetModal(false);
        fetchStats();
      } else {
        alert('❌ Gagal reset data: ' + data.message);
      }
    } catch (error) {
      console.error('Error resetting data:', error);
      alert('❌ Terjadi kesalahan saat reset data');
    }
  };

  // Data Chart - 7 Bulan (Jan - Jul)
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Pendapatan (Rp)',
        data: [
          120000, 190000, 150000, 200000, 300000, 
          stats.totalPendapatan || 0,
          stats.totalPendapatan || 0  // Juli
        ],
        backgroundColor: 'rgba(109, 76, 65, 0.6)',
        borderColor: '#6d4c41',
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '📊 Grafik Pendapatan Bulanan' },
    },
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Jumlah Transaksi',
        data: [
          5, 8, 6, 10, 15, 
          stats.totalTransaksi || 0,
          stats.totalTransaksi || 0  // Juli
        ],
        borderColor: '#6d4c41',
        backgroundColor: 'rgba(109, 76, 65, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '📈 Tren Transaksi' },
    },
  };

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ marginLeft: '250px', height: '100vh', backgroundColor: '#f5f0eb' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '250px', backgroundColor: '#f5f0eb', minHeight: '100vh' }}>
        <Container fluid className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold" style={{ color: '#5d4037' }}>Dashboard</h2>
              <p className="text-muted" style={{ color: '#8d6e63' }}>Selamat datang, {user?.username || 'User'}! 👋</p>
            </div>
            <div>
              <span className="badge" style={{ backgroundColor: '#6d4c41', color: '#fff' }}>Role: {user?.role || 'User'}</span>
            </div>
          </div>

          <Row className="g-4 mb-4">
            <Col md={3}>
              <StatsCard title="Total Produk" value={stats.totalProduk} icon="📦" color="#6d4c41" />
            </Col>
            <Col md={3}>
              <StatsCard title="Total Transaksi" value={stats.totalTransaksi} icon="🧾" color="#6d4c41" />
            </Col>
            <Col md={3}>
              <StatsCard title="Total User" value={stats.totalUser} icon="👥" color="#6d4c41" />
            </Col>
            <Col md={3}>
              <StatsCard title="Total Pendapatan" value={`Rp ${stats.totalPendapatan.toLocaleString()}`} icon="💰" color="#6d4c41" />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Card className="shadow-sm border-0 p-3" style={{ backgroundColor: '#fff8f0' }}>
                <h5 className="mb-3" style={{ color: '#5d4037' }}>👤 Customer Terakhir</h5>
                {latestCustomer ? (
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: '#6d4c41' }}>
                      <span style={{ fontSize: '28px' }}>🙂</span>
                    </div>
                    <div>
                      <h5 className="mb-0" style={{ color: '#4e342e' }}>{latestCustomer}</h5>
                      <small className="text-muted" style={{ color: '#8d6e63' }}>Customer terakhir bertransaksi</small>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">Belum ada customer</p>
                )}
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            <Col md={8}>
              <Card className="shadow-sm border-0 p-3" style={{ backgroundColor: '#fff8f0' }}>
                <Bar data={barData} options={barOptions} />
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0 p-3" style={{ backgroundColor: '#fff8f0' }}>
                <Line data={lineData} options={lineOptions} />
              </Card>
            </Col>
          </Row>

          {/* TOP REVENUE & TOP PROFIT */}
          <Row className="mt-4">
            <Col md={12}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0" style={{ color: '#5d4037' }}>📊 Produk Terlaris & Keuntungan</h5>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => setShowResetModal(true)}
                  style={{ backgroundColor: '#c62828', borderColor: '#b71c1c' }}
                >
                  🔄 Reset Data
                </Button>
              </div>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm border-0 h-100" style={{ backgroundColor: '#fff8f0' }}>
                <Card.Header style={{ backgroundColor: '#6d4c41', color: '#fff' }}>
                  <h5 className="mb-0">🏆 TOP REVENUE</h5>
                  <small>Produk Terlaris</small>
                </Card.Header>
                <Card.Body style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
                  {topProducts.length > 0 ? (
                    topProducts.map((item, index) => (
                      <div 
                        key={index} 
                        className="d-flex justify-content-between align-items-center p-2 mb-1"
                        style={{ 
                          borderBottom: '1px solid #efebe9',
                          backgroundColor: index % 2 === 0 ? '#faf5f0' : 'transparent',
                          borderRadius: '4px'
                        }}
                      >
                        <div>
                          <span className="fw-bold me-2" style={{ color: '#5d4037', fontSize: '14px' }}>{index + 1}.</span>
                          <span style={{ color: '#4e342e', fontWeight: '500' }}>{item.nama_produk}</span>
                          <br />
                          <small className="text-muted" style={{ fontSize: '12px' }}>Qty: {item.qty}</small>
                        </div>
                        <span className="fw-bold" style={{ color: '#6d4c41', fontSize: '15px' }}>
                          Rp {Number(item.total).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center py-4">Belum ada data penjualan</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm border-0 h-100" style={{ backgroundColor: '#fff8f0' }}>
                <Card.Header style={{ backgroundColor: '#4e342e', color: '#fff' }}>
                  <h5 className="mb-0">📈 TOP PROFIT</h5>
                  <small>Produk Paling Untung</small>
                </Card.Header>
                <Card.Body style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
                  {topProfit.length > 0 ? (
                    topProfit.map((item, index) => (
                      <div 
                        key={index} 
                        className="d-flex justify-content-between align-items-center p-2 mb-1"
                        style={{ 
                          borderBottom: '1px solid #efebe9',
                          backgroundColor: index % 2 === 0 ? '#faf5f0' : 'transparent',
                          borderRadius: '4px'
                        }}
                      >
                        <div>
                          <span className="fw-bold me-2" style={{ color: '#5d4037', fontSize: '14px' }}>{index + 1}.</span>
                          <span style={{ color: '#4e342e', fontWeight: '500' }}>{item.nama_produk}</span>
                          <br />
                          <small className="text-muted" style={{ fontSize: '12px' }}>Qty: {item.qty}</small>
                        </div>
                        <span className="fw-bold" style={{ color: '#2e7d32', fontSize: '15px' }}>
                          Rp {Number(item.profit).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center py-4">Belum ada data keuntungan</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={12}>
              <Card className="shadow-sm border-0 p-3" style={{ backgroundColor: '#fff8f0' }}>
                <h5 className="mb-3" style={{ color: '#5d4037' }}>⚡ Aktivitas Sistem</h5>
                <div className="d-flex flex-wrap gap-3">
                  <span className="badge p-2" style={{ backgroundColor: '#6d4c41', color: '#fff' }}>✅ Kelola Produk</span>
                  <span className="badge p-2" style={{ backgroundColor: '#6d4c41', color: '#fff' }}>✅ Kelola Transaksi</span>
                  <span className="badge p-2" style={{ backgroundColor: '#6d4c41', color: '#fff' }}>✅ Cetak Laporan</span>
                  <span className="badge p-2" style={{ backgroundColor: '#8d6e63', color: '#fff' }}>⏳ Manajemen Member</span>
                  <span className="badge p-2" style={{ backgroundColor: '#8d6e63', color: '#fff' }}>⏳ Manajemen Promo</span>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal Reset */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#c62828', color: '#fff' }}>
          <Modal.Title>⚠️ Reset Data</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f5f0eb' }}>
          <p style={{ color: '#5d4037' }}>
            Apakah Anda yakin ingin menghapus semua data <strong>Top Revenue</strong> dan <strong>Top Profit</strong>?
          </p>
          <p className="text-muted small">Data transaksi akan tetap tersimpan.</p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#efebe9' }}>
          <Button variant="secondary" onClick={() => setShowResetModal(false)} style={{ backgroundColor: '#8d6e63', borderColor: '#6d4c41' }}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleReset} style={{ backgroundColor: '#c62828', borderColor: '#b71c1c' }}>
            ✅ Ya, Reset!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;