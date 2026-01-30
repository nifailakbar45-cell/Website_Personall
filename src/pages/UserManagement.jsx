import { useState, useEffect } from 'react';
import { userAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Gagal memuat pengguna');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus pengguna ini?')) {
      try {
        await userAPI.deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        setError('Gagal menghapus pengguna');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
    fetchUsers();
  };

  if (!user || user.role !== 'GURU') {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Anda tidak memiliki akses ke halaman ini.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Tambah Pengguna
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      <UserList
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
