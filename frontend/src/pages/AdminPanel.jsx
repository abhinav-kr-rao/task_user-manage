import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/users?page=${page}`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Error fetching users");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        if (!window.confirm(`Are you sure you want to make user ${newStatus}?`)) return; // [cite: 83]

        try {
            await axios.patch(`http://localhost:5000/api/admin/users/${id}/status`, { status: newStatus });
            fetchUsers();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    useEffect(() => { fetchUsers(); }, [page]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin User Management</h2>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Email</th>
                        <th className="py-2 px-4 border">Role</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="text-center">
                            <td className="py-2 border">{u.email}</td>
                            <td className="py-2 border">{u.role}</td>
                            <td className="py-2 border">
                                <span className={`px-2 py-1 rounded ${u.status === 'active' ? 'bg-green-200' : 'bg-red-200'}`}>
                                    {u.status}
                                </span>
                            </td>
                            <td className="py-2 border">
                                <button
                                    onClick={() => toggleStatus(u.id, u.status)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination [cite: 80] */}
            <div className="mt-4 flex justify-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Prev</button>
                <span className="py-2">Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
            </div>
        </div>
    );
}