export default function UserList({ users, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">Belum ada pengguna</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-gray-900">{user.name}</td>
              <td className="px-6 py-4 text-gray-600">{user.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'GURU'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user.role === 'GURU' ? 'Guru' : 'Siswa'}
                </span>
              </td>
              <td className="px-6 py-4 space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
