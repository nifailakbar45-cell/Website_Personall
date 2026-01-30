import { useState, useEffect } from 'react';
import { taskAPI, userAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'GURU') {
      fetchUsers();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskAPI.getAllTasks();
      setTasks(response.data);
    } catch (err) {
      setError('Gagal memuat tugas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Gagal memuat pengguna');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus tugas ini?')) {
      try {
        await taskAPI.deleteTask(id);
        setTasks(tasks.filter((t) => t.id !== id));
      } catch (err) {
        setError('Gagal menghapus tugas');
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTaskStatus(taskId, newStatus);
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      setError('Gagal mengubah status tugas');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Tugas</h1>
        {user?.role === 'GURU' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Buat Tugas
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && user?.role === 'GURU' && (
        <TaskForm
          task={editingTask}
          users={users}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      <TaskList
        tasks={tasks}
        loading={loading}
        isGuru={user?.role === 'GURU'}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onAnswerSubmitted={fetchTasks}
      />
    </div>
  );
}
