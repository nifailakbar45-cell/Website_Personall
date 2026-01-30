import { useState, useEffect } from 'react';
import { taskAPI } from '../api/client';
import { TASK_STATUS, STATUS_LABELS, STATUS_COLORS, STATUS_ORDER } from '../constants/taskStatus';
import { useAuth } from '../context/AuthContext';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskAPI.getAllTasks();
      // Group tasks by status
      const grouped = {
        [TASK_STATUS.TODO]: [],
        [TASK_STATUS.IN_PROGRESS]: [],
        [TASK_STATUS.DONE]: [],
      };

      response.data.forEach((task) => {
        if (grouped[task.status]) {
          grouped[task.status].push(task);
        }
      });

      setTasks(grouped);
    } catch (err) {
      setError('Gagal memuat tugas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus, currentTasks) => {
    try {
      await taskAPI.updateTaskStatus(taskId, newStatus);
      
      // Update local state
      const task = currentTasks.find((t) => t.id === taskId);
      if (task) {
        const oldStatus = task.status;
        
        // Remove from old status
        setTasks((prev) => ({
          ...prev,
          [oldStatus]: prev[oldStatus].filter((t) => t.id !== taskId),
          [newStatus]: [...prev[newStatus], { ...task, status: newStatus }],
        }));
      }
    } catch (err) {
      setError('Gagal mengubah status tugas');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📊 Kanban Board</h1>
        <button
          onClick={fetchTasks}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUS_ORDER.map((status) => {
          const statusTasks = tasks[status] || [];
          const colors = STATUS_COLORS[status];

          return (
            <div
              key={status}
              className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 min-h-96`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{colors.icon}</span>
                <h2 className={`text-lg font-bold ${colors.text}`}>
                  {STATUS_LABELS[status]}
                </h2>
                <span className="ml-auto bg-white px-2 py-1 rounded font-bold text-sm">
                  {statusTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {statusTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Tidak ada tugas</p>
                ) : (
                  statusTasks.map((task) => (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      status={status}
                      allTasks={statusTasks}
                      onStatusChange={handleStatusChange}
                      isGuru={user?.role === 'GURU'}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KanbanCard({ task, status, allTasks, onStatusChange, isGuru }) {
  const [showStatus, setShowStatus] = useState(false);

  const nextStatus = () => {
    const statuses = Object.values(TASK_STATUS);
    const currentIndex = statuses.indexOf(status);
    return currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : status;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-lg transition">
      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{task.title}</h3>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="text-xs text-gray-500 mb-3">
        👤 {task.user_name}
      </div>

      <div className="flex gap-2 items-center">
        {!isGuru && (
          <>
            <select
              value={status}
              onChange={(e) => onStatusChange(task.id, e.target.value, allTasks)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={TASK_STATUS.TODO}>{STATUS_LABELS[TASK_STATUS.TODO]}</option>
              <option value={TASK_STATUS.IN_PROGRESS}>{STATUS_LABELS[TASK_STATUS.IN_PROGRESS]}</option>
              <option value={TASK_STATUS.DONE}>{STATUS_LABELS[TASK_STATUS.DONE]}</option>
            </select>

            {status !== TASK_STATUS.DONE && (
              <button
                onClick={() => onStatusChange(task.id, nextStatus(), allTasks)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium transition"
                title={`Ubah ke ${STATUS_LABELS[nextStatus()]}`}
              >
                →
              </button>
            )}
          </>
        )}
      </div>

      <div className="text-xs text-gray-400 mt-3 pt-3 border-t">
        {new Date(task.created_at).toLocaleDateString('id-ID')}
      </div>
    </div>
  );
}
