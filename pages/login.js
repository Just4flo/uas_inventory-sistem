import { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // pastikan path ini benar

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Login berhasil:", user);
            router.push("/redirect");
        } catch (error) {
            console.error("Login gagal:", error.message);
            setError("Email atau password salah.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 border-2 border-gray-300 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
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
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-4 rounded-md hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </form>

            {/* Info akun contoh */}
            <div className="mt-6 text-sm text-gray-600 text-center">
                <p>Gunakan akun berikut untuk login:</p>
                <p>staff@gmail.com (123456)</p>
                <p>manager@gmail.com (123456)</p>
                <p>admin@gmail.com (123456)</p>
            </div>
        </div>
    );
};

export default Login;
