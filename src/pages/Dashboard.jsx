import { useAuth } from '../context/AuthContext';

const stats = [
  {
    label: 'Profil Pengguna',
    icon: '👤',
    description: 'Kelola informasi akun Anda',
  },
  {
    label: 'Tugas Saya',
    icon: '📋',
    description: 'Lihat semua tugas yang ditugaskan',
  },
  {
    label: 'Progres',
    icon: '📊',
    description: 'Pantau progres tugas Anda',
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Selamat Datang, {user?.name}! 👋</h1>
        <p className="text-lg opacity-90">
          {user?.role === 'GURU'
            ? 'Kelola pengguna dan tugas dari sini'
            : 'Lihat dan kelola tugas Anda dari sini'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-500"
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{stat.label}</h3>
            <p className="text-gray-600">{stat.description}</p>
          </div>
        ))}
      </div>

      {user?.role === 'GURU' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h2 className="text-lg font-bold text-gray-800 mb-2">📌 Tips untuk Guru</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Buat tugas baru untuk siswa Anda</li>
            <li>✓ Pantau progres semua siswa</li>
            <li>✓ Update informasi pengguna bila diperlukan</li>
            <li>✓ Hapus tugas yang sudah selesai</li>
          </ul>
        </div>
      )}

      {user?.role === 'MURID' && (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
          <h2 className="text-lg font-bold text-gray-800 mb-2">📌 Tips untuk Siswa</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Lihat semua tugas yang ditugaskan kepada Anda</li>
            <li>✓ Update status tugas sesuai progres Anda</li>
            <li>✓ Hubungi guru jika memiliki pertanyaan</li>
          </ul>
        </div>
      )}
    </div>
  );
}
