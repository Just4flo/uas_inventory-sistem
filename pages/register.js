import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase"; // Firebase configuration import

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("staff"); // Default role is 'staff'
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Daftarkan pengguna dengan Firebase Authentication
            await auth.createUserWithEmailAndPassword(email, password);

            // Mengirim data registrasi termasuk role ke API route
            const response = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify({ email, password, role }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (data.success) {
                // Redirect pengguna ke halaman login setelah berhasil registrasi
                router.push("/login"); // Mengarahkan pengguna ke halaman login
            } else {
                setError(data.message); // Menampilkan pesan error jika gagal
            }
        } catch (err) {
            setError(err.message); // Menampilkan error jika terjadi kesalahan
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 border-2 border-gray-300 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <div>
                    <label htmlFor="role" className="block text-sm font-medium mb-1">Select Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-4 rounded-md hover:bg-blue-600 transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
