import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Container } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
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
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [latestCustomer, setLatestCustomer] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

      // Ambil transaksi terbaru
      const transaksiRes = await api.get('/transaksi');
      console.log('Transaksi response:', transaksiRes.data);
      
      const transaksi = transaksiRes.data?.data || transaksiRes.data || [];
      const recent = Array.isArray(transaksi) ? transaksi.slice(-5).reverse() : [];
      setRecentTransactions(recent);
      
      if (recent.length > 0) {
        setLatestCustomer(recent[0].customer_name || 'Umum');
      }
      
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    datasets: [
      {
        label: 'Pendapatan (Rp)',
        data: [120000, 190000, 150000, 200000, 300000, stats.totalPendapatan || 0],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    datasets: [
      {
        label: 'Jumlah Transaksi',
        data: [5, 8, 6, 10, 15, stats.totalTransaksi || 0],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
        <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ marginLeft: '250px', height: '100vh' }}>
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
      <div className="flex-grow-1" style={{ marginLeft: '250px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container fluid className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold">Dashboard</h2>
              <p className="text-muted">Selamat datang, {user?.username || 'User'}! 👋</p>
            </div>
            <div>
              <span className="badge bg-primary p-2">Role: {user?.role || 'User'}</span>
            </div>
          </div>

          <Row className="g-4 mb-4">
            <Col md={3}>
              <StatsCard title="Total Produk" value={stats.totalProduk} icon="📦" color="#2563eb" />
            </Col>
            <Col md={3}>
              <StatsCard title="Total Transaksi" value={stats.totalTransaksi} icon="🧾" color="#22c55e" />
            </Col>
            <Col md={3}>
              <StatsCard title="Total User" value={stats.totalUser} icon="👥" color="#f59e0b" />
            </Col>
            <Col md={3}>
              <StatsCard title="Total Pendapatan" value={`Rp ${stats.totalPendapatan.toLocaleString()}`} icon="💰" color="#ef4444" />
            </Col>
          </Row>

          {/* Customer Terbaru */}
          <Row className="mb-4">
            <Col md={12}>
              <Card className="shadow-sm border-0 p-3">
                <h5 className="mb-3">👤 Customer Terakhir</h5>
                {latestCustomer ? (
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle p-3 me-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '28px' }}>🙂</span>
                    </div>
                    <div>
                      <h5 className="mb-0">{latestCustomer}</h5>
                      <small className="text-muted">Customer terakhir bertransaksi</small>
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
              <Card className="shadow-sm border-0 p-3">
                <Bar data={barData} options={barOptions} />
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0 p-3">
                <Line data={lineData} options={lineOptions} />
              </Card>
            </Col>
          </Row>

          {/* Recent Transactions */}
          <Row className="mt-4">
            <Col md={12}>
              <Card className="shadow-sm border-0 p-3">
                <h5 className="mb-3">🕐 Transaksi Terbaru</h5>
                {recentTransactions.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Customer</th>
                          <th>Tanggal</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((trx, index) => (
                          <tr key={trx.id || index}>
                            <td>{index + 1}</td>
                            <td>{trx.customer_name || 'Umum'}</td>
                            <td>{trx.created_at ? new Date(trx.created_at).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            }) : '-'}</td>
                            <td>Rp {trx.total?.toLocaleString() || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">Belum ada transaksi</p>
                )}
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={12}>
              <Card className="shadow-sm border-0 p-3">
                <h5 className="mb-3">⚡ Aktivitas Sistem</h5>
                <div className="d-flex flex-wrap gap-3">
                  <span className="badge bg-success p-2">✅ Kelola Produk</span>
                  <span className="badge bg-success p-2">✅ Kelola Transaksi</span>
                  <span className="badge bg-success p-2">✅ Cetak Laporan</span>
                  <span className="badge bg-warning p-2">⏳ Manajemen Member</span>
                  <span className="badge bg-warning p-2">⏳ Manajemen Promo</span>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;