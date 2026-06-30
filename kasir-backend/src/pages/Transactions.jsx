// src/pages/Transactions.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Alert, Badge } from 'react-bootstrap';
import { Add, Remove, Delete } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import api from '../api/axiosConfig';

const Transactions = () => {
  // ===== STATE =====
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [change, setChange] = useState(0);
  const [message, setMessage] = useState('');
  const [lastTransaction, setLastTransaction] = useState(null);

  // ===== useEffect =====
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    setTotal(newTotal);
    
    const payAmount = Number(paymentAmount) || 0;
    const changeAmount = payAmount - newTotal;
    setChange(changeAmount > 0 ? changeAmount : 0);
  }, [cart, paymentAmount]);

  // ===== FETCH PRODUK =====
  const fetchProducts = async () => {
    try {
      const response = await api.get('/produk');
      console.log('📦 Response produk:', response.data);
      
      let data = [];
      if (response.data && response.data.data) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      } else {
        data = [];
      }
      
      console.log('📦 Products setelah diproses:', data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setProducts([]);
    }
  };

  // ===== CART FUNCTIONS =====
  const addToCart = (product) => {
    if (product.stok <= 0) {
      setMessage(`❌ Stok ${product.nama_produk} habis!`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.qty >= product.stok) {
        setMessage(`❌ Stok ${product.nama_produk} tidak mencukupi! (tersisa ${product.stok})`);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setMessage('');
  };

  const updateQuantity = (id, delta) => {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);
    
    if (delta > 0 && cartItem && product) {
      if (cartItem.qty >= product.stok) {
        setMessage(`❌ Stok ${product.nama_produk} tidak mencukupi! (tersisa ${product.stok})`);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
    }

    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setPaymentAmount(0);
    setChange(0);
    // JANGAN hapus lastTransaction!
  };

  // ===== PAYMENT FUNCTIONS =====
  const handlePaymentChange = (e) => {
    const value = Number(e.target.value) || 0;
    setPaymentAmount(value);
    
    const newTotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const changeAmount = value - newTotal;
    setChange(changeAmount > 0 ? changeAmount : 0);
  };

  // ===== CHECKOUT =====
  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage('❌ Keranjang kosong!');
      return;
    }

    if (paymentAmount < total) {
      setMessage(`❌ Uang yang diterima kurang! Total: Rp ${total.toLocaleString()}`);
      return;
    }

    try {
      const response = await api.post('/transaksi', {
        items: cart.map(item => ({
          id_produk: item.id,
          qty: item.qty,
          harga: item.harga
        })),
        total: total,
        customer_name: customerName || 'Umum',
        payment: paymentAmount,
        change: change
      });

      console.log('✅ Response transaksi:', response.data);

      const transactionDetail = {
        id: response.data.id || 'N/A',
        customer: customerName || 'Umum',
        items: [...cart],
        total: total,
        payment: paymentAmount,
        change: change,
        createdAt: new Date().toLocaleString()
      };
      
      console.log('📋 Detail transaksi:', transactionDetail);
      setLastTransaction(transactionDetail);

      setMessage(`✅ Transaksi berhasil! Kembalian: Rp ${change.toLocaleString()}`);
      
      setCart([]);
      setCustomerName('');
      setPaymentAmount(0);
      setChange(0);
      
      fetchProducts();
      
      if (window.refreshDashboard) {
        window.refreshDashboard();
      }
      
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('❌ Checkout error:', error);
      setMessage(error.response?.data?.message || '❌ Gagal melakukan transaksi');
    }
  };

  const getStatusBadge = (stok) => {
    if (stok <= 0) return <Badge bg="danger">Habis</Badge>;
    if (stok <= 5) return <Badge bg="warning">Low</Badge>;
    return <Badge bg="success">Ready</Badge>;
  };

  // ===== RENDER =====
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', backgroundColor: '#f5f0eb', minHeight: '100vh' }}>
        <h2 className="mb-4" style={{ color: '#5d4037' }}>🧾 Transaksi Kasir</h2>

        {message && (
          <Alert variant={message.includes('✅') ? 'success' : 'danger'} className="mb-3" onClose={() => setMessage('')} dismissible>
            {message}
          </Alert>
        )}

        <Row className="g-4" style={{ height: 'calc(100vh - 170px)' }}>
          
          {/* === KOLOM KIRI: DAFTAR PRODUK === */}
          <Col md={7} style={{ height: '100%' }}>
            <Card className="shadow-sm border-0 h-100" style={{ backgroundColor: '#fff8f0' }}>
              <Card.Header className="text-white fw-bold" style={{ backgroundColor: '#6d4c41' }}>
                📦 Pilih Produk
              </Card.Header>
              <Card.Body style={{ overflowY: 'auto', maxHeight: 'calc(100% - 60px)' }}>
                <Row>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <Col md={6} lg={4} key={product.id} className="mb-3">
                        <Card 
                          className="text-center p-3 h-100" 
                          style={{ 
                            cursor: 'pointer',
                            border: '1px solid #d7ccc8',
                            backgroundColor: '#fff',
                            transition: 'all 0.2s',
                            borderRadius: '12px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#8d6e63';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(109, 76, 65, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d7ccc8';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          onClick={() => addToCart(product)}
                        >
                          <Card.Body>
                            <div style={{ 
                              height: '200px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              marginBottom: '10px',
                              backgroundColor: '#f5f0eb',
                              borderRadius: '8px',
                              padding: '5px',
                              width: '100%',
                              overflow: 'hidden'
                            }}>
                              {product.foto ? (
                                <img 
                                  src={`http://localhost:3000/uploads/${product.foto}`} 
                                  alt={product.nama_produk}
                                  style={{ 
                                    height: '100%', 
                                    width: '100%', 
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<span style="font-size:64px">☕</span>';
                                  }}
                                />
                              ) : (
                                <span style={{ fontSize: '64px' }}>☕</span>
                              )}
                            </div>
                            <h6 className="fw-bold" style={{ color: '#5d4037', fontSize: '14px' }}>{product.nama_produk}</h6>
                            <div className="d-flex justify-content-center align-items-center gap-1">
                              <small className="text-muted" style={{ fontSize: '11px' }}>Stok: {product.stok}</small>
                              {getStatusBadge(product.stok)}
                            </div>
                            <p className="mb-2 mt-1" style={{ color: '#6d4c41', fontWeight: 'bold', fontSize: '16px' }}>
                              Rp {product.harga?.toLocaleString()}
                            </p>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="w-100"
                              style={{ backgroundColor: '#6d4c41', borderColor: '#5d4037' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                            >
                              <Add /> Add
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <Col md={12}>
                      <p className="text-muted text-center py-4">Belum ada produk</p>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* === KOLOM KANAN: KERANJANG BELANJA === */}
          <Col md={5} style={{ height: '100%' }}>
            <Card className="shadow-sm border-0 h-100" style={{ backgroundColor: '#fff8f0' }}>
              <Card.Header className="text-white fw-bold" style={{ backgroundColor: '#4e342e' }}>
                🛒 Keranjang Belanja
              </Card.Header>
              <Card.Body className="d-flex flex-column" style={{ overflowY: 'auto', maxHeight: 'calc(100% - 60px)' }}>
                <Form.Group className="mb-2">
                  <Form.Label style={{ color: '#5d4037', fontWeight: '600' }}>Nama Customer</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nama customer (opsional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ borderColor: '#d7ccc8' }}
                  />
                </Form.Group>

                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '200px' }}>
                  <Table size="sm" borderless>
                    <thead>
                      <tr style={{ color: '#5d4037', borderBottom: '2px solid #d7ccc8' }}>
                        <th>Produk</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.length > 0 ? (
                        cart.map((item) => (
                          <tr key={item.id}>
                            <td><small style={{ color: '#4e342e' }}>{item.nama_produk}</small></td>
                            <td>
                              <div className="d-flex align-items-center gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline-secondary" 
                                  onClick={() => updateQuantity(item.id, -1)}
                                  style={{ borderColor: '#d7ccc8', color: '#5d4037', padding: '0 6px' }}
                                >
                                  <Remove />
                                </Button>
                                <span className="mx-1" style={{ fontWeight: 'bold', color: '#4e342e' }}>{item.qty}</span>
                                <Button 
                                  size="sm" 
                                  variant="outline-secondary" 
                                  onClick={() => updateQuantity(item.id, 1)}
                                  style={{ borderColor: '#d7ccc8', color: '#5d4037', padding: '0 6px' }}
                                >
                                  <Add />
                                </Button>
                              </div>
                            </td>
                            <td><small>Rp {(item.harga * item.qty).toLocaleString()}</small></td>
                            <td>
                              <Button size="sm" variant="danger" onClick={() => removeFromCart(item.id)}>
                                <Delete />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-3">Keranjang kosong</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                <Alert variant="info" className="mt-2" style={{ backgroundColor: '#efebe9', borderColor: '#d7ccc8', color: '#4e342e' }}>
                  <strong>Total: Rp {total.toLocaleString()}</strong>
                </Alert>

                <Form.Group className="mb-2">
                  <Form.Label style={{ color: '#5d4037', fontWeight: '600' }}>Uang Diterima</Form.Label>
                  <Form.Control
                    type="number"
                    value={paymentAmount || ''}
                    onChange={handlePaymentChange}
                    placeholder="Masukkan nominal uang"
                    style={{ borderColor: '#d7ccc8' }}
                  />
                </Form.Group>

                {paymentAmount > 0 && (
                  <Alert variant={change >= 0 ? 'success' : 'danger'} style={{ borderColor: '#d7ccc8' }}>
                    Kembalian: Rp {change >= 0 ? change.toLocaleString() : '0'}
                  </Alert>
                )}

                <div className="d-flex gap-2 mt-auto">
                  <Button 
                    variant="success" 
                    onClick={handleCheckout} 
                    className="flex-grow-1"
                    style={{ backgroundColor: '#6d4c41', borderColor: '#5d4037' }}
                  >
                    Checkout
                  </Button>
                  <Button variant="secondary" onClick={clearCart} style={{ backgroundColor: '#8d6e63', borderColor: '#6d4c41' }}>
                    Clear
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* === DETAIL TRANSAKSI TERAKHIR === */}
        {lastTransaction && (
          <Row className="mt-4">
            <Col md={12}>
              <Card className="shadow-sm border-0" style={{ backgroundColor: '#fff8f0' }}>
                <Card.Header className="text-white fw-bold" style={{ backgroundColor: '#2e7d32' }}>
                  📋 Detail Transaksi Terakhir
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td><strong>ID Transaksi</strong></td>
                            <td>#{lastTransaction.id}</td>
                          </tr>
                          <tr>
                            <td><strong>Customer</strong></td>
                            <td>{lastTransaction.customer}</td>
                          </tr>
                          <tr>
                            <td><strong>Waktu</strong></td>
                            <td>{lastTransaction.createdAt}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={6}>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td><strong>Total</strong></td>
                            <td>Rp {lastTransaction.total.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td><strong>Uang Diterima</strong></td>
                            <td>Rp {lastTransaction.payment.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td><strong>Kembalian</strong></td>
                            <td style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                              Rp {lastTransaction.change.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <hr />
                  <h6 className="mb-2">🛒 Produk yang Dibeli:</h6>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Nama Produk</th>
                        <th>Qty</th>
                        <th>Harga</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastTransaction.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.nama_produk}</td>
                          <td>{item.qty}</td>
                          <td>Rp {item.harga.toLocaleString()}</td>
                          <td>Rp {(item.harga * item.qty).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Transactions;