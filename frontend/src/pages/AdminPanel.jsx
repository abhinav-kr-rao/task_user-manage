import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.VITE_BASE_URL

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_URL}/ api / users ? page = ${page} & limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Error fetching users", err);
            alert("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        if (!window.confirm(`Are you sure you want to make user ${newStatus} ? `)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${BASE_URL}/api/users/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    useEffect(() => { fetchUsers(); }, [page]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin User Management</h2>
            {loading ? <p>Loading...</p> : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border shadow-sm rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 border-b text-left">Full Name</th>
                                    <th className="py-3 px-4 border-b text-left">Email</th>
                                    <th className="py-3 px-4 border-b text-center">Role</th>
                                    <th className="py-3 px-4 border-b text-center">Status</th>
                                    <th className="py-3 px-4 border-b text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{u.full_name}</td>
                                        <td className="py-2 px-4 border-b">{u.email}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b text-center">
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => toggleStatus(u.id, u.status)}
                                                    className={`px-3 py-1 rounded text-white text-sm ${u.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                                >
                                                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}