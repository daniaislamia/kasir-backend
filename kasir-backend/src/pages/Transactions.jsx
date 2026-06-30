import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaMoneyBillWave, FaExchangeAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import api from '../api/axiosConfig';

const Transactions = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produk');
      const data = response.data?.data || response.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    if (product.stok <= 0) {
      setMessage(`❌ Stok ${product.nama_produk} habis!`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.qty >= product.stok) {
        setMessage(`❌ Stok ${product.nama_produk} tidak mencukupi!`);
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
        setMessage(`❌ Stok ${product.nama_produk} tidak mencukupi!`);
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
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.1;
  };

  const calculateService = (subtotal) => {
    return 0;
  };

  const calculateDiscount = (subtotal) => {
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const service = calculateService(subtotal);
    const discount = calculateDiscount(subtotal);
    return subtotal + tax + service - discount;
  };

  const calculateChange = () => {
    const total = calculateTotal();
    return paymentAmount - total;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage('❌ Keranjang kosong!');
      return;
    }

    const total = calculateTotal();
    if (paymentAmount < total) {
      setMessage('❌ Uang yang diterima kurang!');
      return;
    }

    try {
      await api.post('/transaksi', {
        total: total,
        customer_name: customerName || 'Umum',
        payment: paymentAmount,
        change: calculateChange(),
        payment_method: paymentMethod,
        items: cart.map(item => ({
          id_produk: item.id,
          qty: item.qty,
          harga: item.harga
        }))
      });

      setMessage(`✅ Transaksi berhasil! Customer: ${customerName || 'Umum'}`);
      clearCart();
      fetchProducts();
      
      if (window.refreshDashboard) {
        window.refreshDashboard();
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.response?.data?.message || '❌ Gagal melakukan transaksi');
    }
  };

  const getStatusBadge = (stok) => {
    if (stok <= 0) return <Badge bg="danger">Habis</Badge>;
    if (stok <= 5) return <Badge bg="warning">Low</Badge>;
    return <Badge bg="success">Ready</Badge>;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const service = calculateService(subtotal);
  const discount = calculateDiscount(subtotal);
  const total = calculateTotal();
  const change = calculateChange();

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
          <h2 className="fw-bold mb-4">🧾 POS Kasir</h2>

          {message && (
            <Alert variant={message.includes('✅') ? 'success' : 'danger'} onClose={() => setMessage('')} dismissible>
              {message}
            </Alert>
          )}

          <Row>
            {/* Daftar Produk */}
            <Col md={7}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0">📦 Menu Produk</h6>
                </Card.Header>
                <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <Row>
                    {products.map((product) => (
                      <Col md={6} lg={4} key={product.id} className="mb-3">
                        <Card className="h-100 text-center p-2" style={{ cursor: 'pointer' }} onClick={() => addToCart(product)}>
                          <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {product.foto ? (
                              <img 
                                src={`http://localhost:3000/uploads/${product.foto}`} 
                                alt={product.nama_produk}
                                style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                            ) : (
                              <span style={{ fontSize: '40px' }}>☕</span>
                            )}
                          </div>
                          <Card.Body className="p-2">
                            <small className="fw-bold">{product.nama_produk}</small>
                            <div className="d-flex justify-content-between align-items-center mt-1">
                              <small className="text-muted">Stock: {product.stok}</small>
                              {getStatusBadge(product.stok)}
                            </div>
                            <h6 className="mt-2">Rp {product.harga?.toLocaleString()}</h6>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="w-100"
                              disabled={product.stok <= 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                            >
                              <FaPlus /> Add
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Keranjang Belanja */}
            <Col md={5}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-success text-white">
                  <h6 className="mb-0"><FaShoppingCart /> Cart Pesanan</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-2">
                    <Form.Label>Nama Customer</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nama customer (opsional)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </Form.Group>

                  <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="mb-2">
                    {cart.length > 0 ? (
                      cart.map((item) => (
                        <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                          <div>
                            <small className="fw-bold">{item.nama_produk}</small>
                            <div className="d-flex align-items-center gap-1 mt-1">
                              <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, -1)}>
                                <FaMinus />
                              </Button>
                              <span className="mx-1">{item.qty}</span>
                              <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, 1)}>
                                <FaPlus />
                              </Button>
                            </div>
                          </div>
                          <div className="text-end">
                            <small>Rp {(item.harga * item.qty).toLocaleString()}</small>
                            <Button size="sm" variant="danger" className="ms-2" onClick={() => removeFromCart(item.id)}>
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted text-center py-3">Cart masih kosong.</p>
                    )}
                  </div>

                  <hr />

                  {/* Metode Pembayaran - Hanya Cash dan Transfer */}
                  <Form.Group className="mb-2">
                    <Form.Label>Metode Pembayaran</Form.Label>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button 
                        variant={paymentMethod === 'cash' ? 'success' : 'outline-secondary'} 
                        size="sm"
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <FaMoneyBillWave /> Cash
                      </Button>
                      <Button 
                        variant={paymentMethod === 'transfer' ? 'success' : 'outline-secondary'} 
                        size="sm"
                        onClick={() => setPaymentMethod('transfer')}
                      >
                        <FaExchangeAlt /> Transfer
                      </Button>
                    </div>
                  </Form.Group>

                  {/* Uang Diterima */}
                  <Form.Group className="mb-2">
                    <Form.Label>Uang Diterima</Form.Label>
                    <Form.Control
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                      placeholder="Masukkan nominal uang"
                    />
                  </Form.Group>

                  {/* Perhitungan */}
                  <div className="mt-2">
                    <div className="d-flex justify-content-between">
                      <span>Subtotal</span>
                      <span>Rp {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>Diskon</span>
                      <span>Rp {discount.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>Tax 10%</span>
                      <span>Rp {tax.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>Service 0%</span>
                      <span>Rp {service.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span>Rp {total.toLocaleString()}</span>
                    </div>
                    {paymentAmount > 0 && (
                      <div className="d-flex justify-content-between fw-bold text-success">
                        <span>Kembalian</span>
                        <span>Rp {change >= 0 ? change.toLocaleString() : '0'}</span>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <Button variant="success" onClick={handleCheckout} className="flex-grow-1">
                      Checkout
                    </Button>
                    <Button variant="secondary" onClick={clearCart}>
                      Clear
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Transactions;