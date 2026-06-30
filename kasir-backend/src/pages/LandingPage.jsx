import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaCoffee, FaShoppingCart, FaChartLine, FaUsers } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#0f172a' }}>
      {/* Header */}
      <div className="py-3 px-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
        <div className="d-flex justify-content-between align-items-center container">
          <h3 className="text-white m-0">☕ Kedai Kopi AIM</h3>
          <div>
            <Button 
              variant="outline-light" 
              className="me-2"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="primary"
              onClick={() => navigate('/register')}
            >
              Daftar
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <Container className="py-5 text-center text-white">
        <Row className="justify-content-center">
          <Col md={8}>
            <h1 className="display-3 fw-bold mb-4">
              Solusi POS Terbaik untuk <br />
              <span style={{ color: '#f0b90b' }}>Kedai Kopi</span> Anda
            </h1>
            <p className="lead text-muted mb-4">
              Kelola transaksi, produk, dan laporan dengan mudah.
              Sistem kasir modern untuk bisnis Anda.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/register')}
              >
                Mulai Sekarang
              </Button>
              <Button 
                variant="outline-light" 
                size="lg"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Features */}
      <Container className="py-5">
        <Row className="g-4">
          <Col md={3}>
            <Card className="h-100 text-center bg-dark text-white border-secondary">
              <Card.Body>
                <FaCoffee size={40} className="mb-3" style={{ color: '#f0b90b' }} />
                <h5>Manajemen Produk</h5>
                <p className="text-muted">Kelola menu kopi dan produk dengan mudah</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center bg-dark text-white border-secondary">
              <Card.Body>
                <FaShoppingCart size={40} className="mb-3" style={{ color: '#f0b90b' }} />
                <h5>POS Kasir</h5>
                <p className="text-muted">Transaksi cepat dan mudah</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center bg-dark text-white border-secondary">
              <Card.Body>
                <FaChartLine size={40} className="mb-3" style={{ color: '#f0b90b' }} />
                <h5>Laporan Real-time</h5>
                <p className="text-muted">Pantau pendapatan dan tren bisnis</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center bg-dark text-white border-secondary">
              <Card.Body>
                <FaUsers size={40} className="mb-3" style={{ color: '#f0b90b' }} />
                <h5>Multi-user</h5>
                <p className="text-muted">Kelola kasir dan admin</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <div className="py-4 text-center text-muted border-top border-secondary">
        <Container>
          <p className="mb-0">© 2026 Kedai Kopi AIM. All rights reserved.</p>
        </Container>
      </div>
    </div>
  );
};

export default LandingPage;