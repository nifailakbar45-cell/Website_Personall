import { useState } from 'react';
import { taskAPI } from '../api/client';

export default function AnswerForm({ task, onAnswerSubmitted }) {
  const [answer, setAnswer] = useState(task?.answer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(!task?.answer);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      setMessage('Jawaban tidak boleh kosong');
      return;
    }

    setIsSubmitting(true);
    try {
      await taskAPI.submitAnswer(task.id, answer);
      setMessage('✅ Jawaban berhasil dikirim!');
      setIsEditing(false);
      if (onAnswerSubmitted) {
        onAnswerSubmitted();
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Gagal mengirim jawaban: ' + error.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-semibold text-blue-900 mb-3">📝 Jawaban Tugas</h4>
      
      {!isEditing && task?.answer ? (
        <div className="space-y-2">
          <div className="p-3 bg-white border border-gray-200 rounded">
            <p className="text-gray-700 whitespace-pre-wrap">{task.answer}</p>
            <p className="text-xs text-gray-500 mt-2">
              Dikirim: {new Date(task.answer_submitted_at).toLocaleString('id-ID')}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ✏️ Edit Jawaban
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Tulis jawaban Anda di sini..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
          />
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              {isSubmitting ? '📤 Mengirim...' : '📤 Kirim Jawaban'}
            </button>
            {!isEditing && task?.answer && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Batal
              </button>
            )}
          </div>
          
          {message && (
            <p className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
