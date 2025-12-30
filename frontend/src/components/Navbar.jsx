import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-purple-700 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Purple Merit</Link>

                <div>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span>Welcome, {user.role}</span>
                            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="hover:underline">Admin Panel</Link>
                            )}
                            {/* LOGOUT BUTTON [cite: 95] */}
                            <button
                                onClick={logout}
                                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/signup" className="hover:underline">Signup</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}