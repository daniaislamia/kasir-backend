// src/pages/Users.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col, Badge } from 'react-bootstrap';
import { Add, Edit, Delete } from '@mui/icons-material';
import Sidebar from '../components/Layout/Sidebar';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'kasir'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      console.log('📦 Users response:', response.data);
      const data = response.data?.data || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setMessage('Gagal mengambil data user');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (userData = null) => {
    if (userData) {
      setEditingId(userData.id);
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        password: '',
        role: userData.role || 'kasir'
      });
    } else {
      setEditingId(null);
      setFormData({ username: '', email: '', password: '', role: 'kasir' });
    }
    setShowModal(true);
    setMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ username: '', email: '', password: '', role: 'kasir' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email) {
      setMessage('❌ Username dan Email wajib diisi!');
      return;
    }

    if (!editingId && !formData.password) {
      setMessage('❌ Password wajib diisi untuk user baru!');
      return;
    }

    try {
      if (editingId) {
        const updateData = {
          username: formData.username,
          email: formData.email,
          role: formData.role
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await api.put(`/users/${editingId}`, updateData);
        setMessage('✅ User berhasil diupdate!');
      } else {
        await api.post('/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        setMessage('✅ User berhasil ditambahkan!');
      }
      
      fetchUsers();
      setTimeout(handleCloseModal, 1500);
    } catch (error) {
      console.error('❌ Error:', error);
      setMessage(error.response?.data?.message || '❌ Terjadi kesalahan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
        setMessage('✅ User berhasil dihapus!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('❌ Error:', error);
        setMessage('❌ Gagal menghapus user');
      }
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'danger',
      kasir: 'primary'
    };
    return <Badge bg={colors[role] || 'secondary'}>{role?.toUpperCase() || 'USER'}</Badge>;
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

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', backgroundColor: '#f5f0eb', minHeight: '100vh' }}>
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold" style={{ color: '#5d4037' }}>👥 Manajemen User</h2>
              <p className="text-muted" style={{ color: '#8d6e63' }}>Kelola akses user ke sistem</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => handleOpenModal()}
              style={{ backgroundColor: '#6d4c41', borderColor: '#5d4037' }}
            >
              <Add /> Tambah User
            </Button>
          </div>

          {message && (
            <Alert variant={message.includes('✅') ? 'success' : 'danger'} onClose={() => setMessage('')} dismissible>
              {message}
            </Alert>
          )}

          <Card className="shadow-sm border-0" style={{ backgroundColor: '#fff8f0' }}>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-light" style={{ backgroundColor: '#efebe9' }}>
                    <tr>
                      <th style={{ color: '#5d4037' }}>Username</th>
                      <th style={{ color: '#5d4037' }}>Email</th>
                      <th style={{ color: '#5d4037' }}>Role</th>
                      <th style={{ color: '#5d4037' }}>Active</th>
                      <th style={{ color: '#5d4037' }}>Last Login</th>
                      <th style={{ color: '#5d4037' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((userData) => (
                        <tr key={userData.id}>
                          <td><strong>{userData.username}</strong></td>
                          <td>{userData.email}</td>
                          <td>{getRoleBadge(userData.role)}</td>
                          <td><Badge bg="success">TRUE</Badge></td>
                          <td>{userData.last_login || '-'}</td>
                          <td>
                            <Button 
                              variant="warning" 
                              size="sm" 
                              onClick={() => handleOpenModal(userData)} 
                              className="me-2"
                              style={{ backgroundColor: '#8d6e63', borderColor: '#6d4c41', color: '#fff' }}
                            >
                              <Edit />
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(userData.id)}>
                              <Delete />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">Belum ada user</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Modal Form */}
          <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton style={{ backgroundColor: '#6d4c41', color: '#fff' }}>
              <Modal.Title>{editingId ? '✏️ Edit User' : '➕ Tambah User'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body style={{ backgroundColor: '#f5f0eb' }}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#5d4037', fontWeight: '600' }}>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: '#d7ccc8' }}
                        placeholder="Masukkan username"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#5d4037', fontWeight: '600' }}>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: '#d7ccc8' }}
                        placeholder="Masukkan email"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#5d4037', fontWeight: '600' }}>
                        {editingId ? 'Password (kosongkan jika tidak diubah)' : 'Password'}
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingId}
                        style={{ borderColor: '#d7ccc8' }}
                        placeholder={editingId ? 'Kosongkan jika tidak diubah' : 'Masukkan password'}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#5d4037', fontWeight: '600' }}>Role</Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        style={{ borderColor: '#d7ccc8' }}
                      >
                        <option value="kasir">Kasir</option>
                        <option value="admin">Admin</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer style={{ backgroundColor: '#efebe9' }}>
                <Button variant="secondary" onClick={handleCloseModal} style={{ backgroundColor: '#8d6e63', borderColor: '#6d4c41' }}>
                  Batal
                </Button>
                <Button variant="primary" type="submit" style={{ backgroundColor: '#6d4c41', borderColor: '#5d4037' }}>
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

export default Users;