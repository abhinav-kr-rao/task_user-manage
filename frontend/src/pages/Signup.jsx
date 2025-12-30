import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { signupAction } from '../api/authActions';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Validation Logic
    const validate = () => {
        if (!formData.full_name || !formData.email || !formData.password) {
            return "All fields are required";
        }
        if (formData.password.length < 6) {
            return "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match";
        }
        // Simple email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return "Invalid email format";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            // Use the centralized signup action
            const result = await signupAction({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password
            });

            if (result.success) {
                alert('Account created! Please login.');
                navigate('/login');
            } else {
                setError(result.error || 'Signup failed');
            }
        } catch (err) {
            setError('An unexpected error occurred'.concat(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-3 py-2 border rounded"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-3 py-2 border rounded"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 chars)"
                        className="w-full px-3 py-2 border rounded"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-3 py-2 border rounded"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                </p>
            </div>
        </div>
    );
}