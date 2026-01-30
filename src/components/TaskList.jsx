import { useState } from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '../constants/taskStatus';
import AnswerForm from './AnswerForm';

const statusLabels = STATUS_LABELS;
const statusColors = STATUS_COLORS;

export default function TaskList({
  tasks,
  loading,
  isGuru,
  onEdit,
  onDelete,
  onStatusChange,
  onAnswerSubmitted,
}) {
  const [expandedTask, setExpandedTask] = useState(null);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">Belum ada tugas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 cursor-pointer" onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{task.title}</h3>
              <p className="text-gray-600 text-sm">
                Siswa: <span className="font-medium">{task.user_name}</span>
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                statusColors[task.status].bg
              } ${statusColors[task.status].text}`}
            >
              <span>{statusColors[task.status].icon}</span>
              {statusLabels[task.status]}
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 mb-4">{task.description}</p>
          )}

          {/* Show answer indicator */}
          {task.answer && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded flex items-center justify-between">
              <p className="text-green-800 text-sm font-medium">✅ Ada jawaban dari siswa</p>
              <span className="text-xs text-green-600">
                {new Date(task.answer_submitted_at).toLocaleDateString('id-ID')}
              </span>
            </div>
          )}

          {/* Show answer form only for students and if task is not DONE */}
          {!isGuru && task.status !== 'DONE' && expandedTask === task.id && (
            <AnswerForm task={task} onAnswerSubmitted={() => {
              if (onAnswerSubmitted) onAnswerSubmitted();
            }} />
          )}

          {/* Show submitted answer for guru or when task is done */}
          {task.answer && (expandedTask === task.id || task.status === 'DONE') && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📝 Jawaban Siswa:</h4>
              <div className="p-3 bg-white border border-gray-200 rounded">
                <p className="text-gray-700 whitespace-pre-wrap">{task.answer}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Dikirim: {new Date(task.answer_submitted_at).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-400">
              {new Date(task.created_at).toLocaleDateString('id-ID')}
            </div>

            <div className="space-x-2">
              {!isGuru && (
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TODO">Belum Dimulai</option>
                  <option value="IN_PROGRESS">Sedang Dikerjakan</option>
                  <option value="DONE">Selesai</option>
                </select>
              )}

              {isGuru && (
                <>
                  <button
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                  >
                    {expandedTask === task.id ? 'Tutup' : 'Lihat'}
                  </button>
                  <button
                    onClick={() => onEdit(task)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                  >
                    Hapus
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
