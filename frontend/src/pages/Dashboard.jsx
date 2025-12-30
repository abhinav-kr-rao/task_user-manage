import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Dashboard() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', email: '' });


    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setFormData({ full_name: res.data.full_name, email: res.data.email });
        } catch (err) {
            console.log('error getting profile', err);

            console.error(err);
        }
    };

    useEffect(() => {

        const fun = async () => {
            await fetchProfile();
        }
        fun();
    }, []);
    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/users/me', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditing(false);
            fetchProfile(); // Refresh data
            alert('Profile updated successfully');
        } catch (err) {
            alert('Failed to update profile');
            console.log(err);

        }
    };

    if (!profile) return <div className="p-8 text-center">Loading Profile...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">Role</label>
                    <div className="p-2 bg-gray-100 rounded text-gray-600 uppercase text-sm font-semibold inline-block">
                        {profile.role}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Full Name</label>
                    {isEditing ? (
                        <input
                            className="w-full border p-2 rounded"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    ) : (
                        <div className="p-2 border-b">{profile.full_name}</div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Email</label>
                    {isEditing ? (
                        <input
                            className="w-full border p-2 rounded"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    ) : (
                        <div className="p-2 border-b">{profile.email}</div>
                    )}
                </div>

                <div className="pt-4 flex gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}