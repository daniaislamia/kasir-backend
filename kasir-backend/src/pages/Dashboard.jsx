// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api/axiosConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProduk: 0,
    totalTransaksi: 0,
    totalUser: 0,
    totalPendapatan: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [produkRes, transaksiRes, userRes] = await Promise.all([
        api.get('/produk'),
        api.get('/transaksi'),
        api.get('/users')
      ]);

      const produk = produkRes.data || [];
      const transaksi = transaksiRes.data || [];
      const users = userRes.data || [];

      const totalPendapatan = transaksi.reduce((sum, t) => sum + (t.total || 0), 0);

      setStats({
        totalProduk: produk.length,
        totalTransaksi: transaksi.length,
        totalUser: users.length,
        totalPendapatan: totalPendapatan
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Data untuk chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    datasets: [
      {
        label: 'Pendapatan (Rp)',
        data: [120000, 190000, 150000, 200000, 300000, 450000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Grafik Pendapatan Bulanan',
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Dashboard</h2>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center p-3 shadow-sm">
            <Card.Body>
              <h5>Total Produk</h5>
              <h2>{stats.totalProduk}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 shadow-sm">
            <Card.Body>
              <h5>Total Transaksi</h5>
              <h2>{stats.totalTransaksi}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 shadow-sm">
            <Card.Body>
              <h5>Total User</h5>
              <h2>{stats.totalUser}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 shadow-sm">
            <Card.Body>
              <h5>Total Pendapatan</h5>
              <h2>Rp {stats.totalPendapatan.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Chart */}
      <Row>
        <Col md={8}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <Bar data={chartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5>Aktivitas Sistem</h5>
              <ul className="list-unstyled">
                <li>✅ Kelola Produk</li>
                <li>✅ Kelola Transaksi</li>
                <li>✅ Cetak Laporan</li>
                <li>⏳ Manajemen Member</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;