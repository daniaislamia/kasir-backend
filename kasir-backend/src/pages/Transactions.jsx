// src/pages/Transactions.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Alert } from 'react-bootstrap';
import { Add, Remove, Delete } from '@mui/icons-material';
import api from '../api/axiosConfig';

const Transactions = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [change, setChange] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    setTotal(newTotal);
    calculateChange(newTotal);
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/produk');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
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
  };

  const calculateChange = (totalAmount) => {
    const payAmount = Number(paymentAmount) || 0;
    const changeAmount = payAmount - totalAmount;
    setChange(changeAmount > 0 ? changeAmount : 0);
  };

  const handlePaymentChange = (e) => {
    const value = Number(e.target.value) || 0;
    setPaymentAmount(value);
    calculateChange(value);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage('Keranjang kosong!');
      return;
    }

    if (paymentAmount < total) {
      setMessage('Uang yang diterima kurang!');
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

      setMessage(`Transaksi berhasil! Kembalian: Rp ${change.toLocaleString()}`);
      clearCart();
      fetchProducts(); // Refresh stok
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal melakukan transaksi');
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Transaksi Kasir</h2>

      <Row>
        {/* Daftar Produk */}
        <Col md={7}>
          <Card className="shadow-sm p-3">
            <h5>Pilih Produk</h5>
            <Row>
              {products.map((product) => (
                <Col md={4} key={product.id} className="mb-2">
                  <Card 
                    className="text-center p-2" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => addToCart(product)}
                  >
                    <Card.Body>
                      <h6>{product.nama_produk}</h6>
                      <p className="mb-0">Rp {product.harga?.toLocaleString()}</p>
                      <small>Stok: {product.stok}</small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Keranjang Belanja */}
        <Col md={5}>
          <Card className="shadow-sm p-3">
            <h5>Keranjang Belanja</h5>
            <Form.Group className="mb-2">
              <Form.Label>Nama Customer</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama customer (opsional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Form.Group>

            <Table size="sm">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nama_produk}</td>
                    <td>
                      <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, -1)}>
                        <Remove />
                      </Button>
                      <span className="mx-2">{item.qty}</span>
                      <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, 1)}>
                        <Add />
                      </Button>
                    </td>
                    <td>Rp {(item.harga * item.qty).toLocaleString()}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => removeFromCart(item.id)}>
                        <Delete />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Alert variant="info">
              <strong>Total: Rp {total.toLocaleString()}</strong>
            </Alert>

            <Form.Group className="mb-2">
              <Form.Label>Uang Diterima</Form.Label>
              <Form.Control
                type="number"
                value={paymentAmount}
                onChange={handlePaymentChange}
                placeholder="Masukkan nominal uang"
              />
            </Form.Group>

            {paymentAmount > 0 && (
              <Alert variant={change >= 0 ? 'success' : 'danger'}>
                Kembalian: Rp {change.toLocaleString()}
              </Alert>
            )}

            <div className="d-flex gap-2">
              <Button variant="success" onClick={handleCheckout} className="flex-grow-1">
                Checkout
              </Button>
              <Button variant="secondary" onClick={clearCart}>
                Clear
              </Button>
            </div>

            {message && <Alert variant="info" className="mt-2">{message}</Alert>}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Transactions;