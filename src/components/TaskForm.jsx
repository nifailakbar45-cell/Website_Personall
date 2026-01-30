import { useState, useEffect } from 'react';
import { taskAPI } from '../api/client';

export default function TaskForm({ task, users, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        user_id: task.user_id,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (task) {
        await taskAPI.updateTask(task.id, formData);
      } else {
        await taskAPI.createTask(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan tugas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {task ? 'Edit Tugas' : 'Buat Tugas Baru'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Judul Tugas</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan judul tugas"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Deskripsi</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan deskripsi tugas"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Pilih Siswa</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Pilih Siswa --</option>
            {users
              .filter((u) => u.role === 'MURID')
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
