import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { Add, Edit, Delete } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import api from '../api/axiosConfig';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    nama_produk: '', 
    harga: '', 
    stok: '' 
  });
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produk');
      const data = response.data?.data || response.data || [];
      setProducts(Array.isArray(data) ? data : []);
      setMessage('');
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        nama_produk: product.nama_produk || '',
        harga: product.harga || '',
        stok: product.stok || ''
      });
      if (product.foto) {
        setImagePreview(`http://localhost:3000/uploads/${product.foto}`);
      } else {
        setImagePreview(null);
      }
    } else {
      setEditingId(null);
      setFormData({ nama_produk: '', harga: '', stok: '' });
      setImagePreview(null);
    }
    setImage(null);
    setShowModal(true);
    setMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ nama_produk: '', harga: '', stok: '' });
    setImage(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama_produk || !formData.harga || !formData.stok) {
      setMessage('Semua field wajib diisi!');
      return;
    }

    const data = new FormData();
    data.append('nama_produk', formData.nama_produk);
    data.append('harga', formData.harga);
    data.append('stok', formData.stok);
    if (image) data.append('foto', image);

    try {
      if (editingId) {
        await api.put(`/produk/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('✅ Produk berhasil diupdate!');
      } else {
        await api.post('/produk', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('✅ Produk berhasil ditambahkan!');
      }
      
      fetchProducts();
      setTimeout(handleCloseModal, 1500);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.response?.data?.message || '❌ Terjadi kesalahan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await api.delete(`/produk/${id}`);
        fetchProducts();
        setMessage('✅ Produk berhasil dihapus!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error:', error);
        setMessage('❌ Gagal menghapus produk');
      }
    }
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
            <h2 className="fw-bold">📦 Manajemen Produk</h2>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <Add /> Tambah Produk
            </Button>
          </div>

          {message && (
            <Alert variant={message.includes('✅') ? 'success' : 'danger'} onClose={() => setMessage('')} dismissible>
              {message}
            </Alert>
          )}

          <Card className="shadow-sm border-0">
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nama Produk</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Foto</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.nama_produk}</td>
                        <td>Rp {Number(product.harga)?.toLocaleString() || 0}</td>
                        <td>{product.stok}</td>
                        <td>
                          {product.foto ? (
                            <img 
                              src={`http://localhost:3000/uploads/${product.foto}`} 
                              alt={product.nama_produk} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <Button variant="warning" size="sm" onClick={() => handleOpenModal(product)} className="me-2">
                            <Edit />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                            <Delete />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">Belum ada produk</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Modal Form */}
          <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{editingId ? '✏️ Edit Produk' : '➕ Tambah Produk'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nama Produk</Form.Label>
                      <Form.Control
                        type="text"
                        name="nama_produk"
                        value={formData.nama_produk}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Harga</Form.Label>
                      <Form.Control
                        type="number"
                        name="harga"
                        value={formData.harga}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Stok</Form.Label>
                      <Form.Control
                        type="number"
                        name="stok"
                        value={formData.stok}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Foto Produk</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="text-center">
                    {imagePreview ? (
                      <div>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ 
                            width: '100%', 
                            maxHeight: '200px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '2px solid #ddd'
                          }} 
                        />
                        <p className="text-muted mt-2 small">Preview Foto</p>
                      </div>
                    ) : (
                      <div className="border rounded p-4 text-muted" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>No Image</span>
                      </div>
                    )}
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Batal
                </Button>
                <Button variant="primary" type="submit">
                  {editingId ? 'Update' : 'Simpan'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default Products;