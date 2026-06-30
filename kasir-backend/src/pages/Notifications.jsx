import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import { FaPrint, FaReceipt, FaCheckCircle } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import api from '../api/axiosConfig';

const Notifications = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTransactions();
    
    // Auto refresh setiap 5 detik
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transaksi');
      const data = response.data?.data || response.data || [];
      setTransactions(Array.isArray(data) ? data.slice(0, 10) : []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setMessage('Gagal mengambil data transaksi');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = (trx) => {
    const printContent = `
      <html>
        <head>
          <title>Struk Pembayaran</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .receipt { max-width: 300px; margin: 0 auto; }
            .item { display: flex; justify-content: space-between; padding: 4px 0; }
            .total { border-top: 1px solid #000; padding-top: 10px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h3>☕ Kedai Kopi AIM</h3>
              <p>Jl. Contoh No. 123</p>
              <p>Telp: 0812-3456-7890</p>
            </div>
            <div>
              <p><strong>No. Transaksi:</strong> #${trx.id}</p>
              <p><strong>Customer:</strong> ${trx.customer_name || 'Umum'}</p>
              <p><strong>Tanggal:</strong> ${formatDate(trx.created_at)}</p>
            </div>
            <div class="total">
              <div class="item">
                <span>Total</span>
                <span>Rp ${trx.total?.toLocaleString() || 0}</span>
              </div>
            </div>
            <div class="footer">
              <p>Terima kasih! 😊</p>
            </div>
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
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
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">🔔 Notifikasi & Struk</h2>
            <Button variant="primary" onClick={fetchTransactions}>
              <FaReceipt /> Refresh
            </Button>
          </div>

          {message && (
            <Alert variant="danger" onClose={() => setMessage('')} dismissible>
              {message}
            </Alert>
          )}

          {/* Notifikasi Transaksi Terbaru */}
          <Row className="mb-4">
            <Col md={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-success text-white">
                  <h6 className="mb-0"><FaCheckCircle /> Transaksi Terbaru</h6>
                </Card.Header>
                <Card.Body>
                  {transactions.length > 0 ? (
                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Tanggal</th>
                            <th>Total</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((trx) => (
                            <tr key={trx.id}>
                              <td>#{trx.id}</td>
                              <td>{trx.customer_name || 'Umum'}</td>
                              <td>{formatDate(trx.created_at)}</td>
                              <td>Rp {trx.total?.toLocaleString() || 0}</td>
                              <td>
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  onClick={() => handlePrint(trx)}
                                >
                                  <FaPrint /> Cetak Struk
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-muted text-center py-3">Belum ada transaksi</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Notifikasi Otomatis */}
          <Row>
            <Col md={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-info text-white">
                  <h6 className="mb-0">💡 Informasi</h6>
                </Card.Header>
                <Card.Body>
                  <p className="mb-0">
                    • Data transaksi akan <strong>otomatis refresh</strong> setiap 5 detik
                  </p>
                  <p className="mb-0">
                    • Klik <strong>"Cetak Struk"</strong> untuk mencetak struk pembayaran
                  </p>
                  <p className="mb-0">
                    • Total transaksi: <strong>{transactions.length}</strong>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Notifications;