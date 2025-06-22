import { FaHome } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();

    const navigateToLogin = () => {
        router.push("/login"); // Arahkan ke halaman login
    };

    const navigateToRegister = () => {
        router.push("/register"); // Arahkan ke halaman register
    };

    return (
        <div className="container mx-auto p-4 text-center">
            {/* Header with Icon */}
            <h1 className="text-4xl font-bold">
                <FaHome className="inline mr-2 text-blue-600" />
                Welcome to Inventory System
            </h1>

            <p className="mt-4 text-lg text-gray-700">
                Manage your stock efficiently.
            </p>

            {/* Buttons for Login and Register */}
            <div className="mt-8">
                <button
                    onClick={navigateToLogin}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 mr-4"
                >
                    Login
                </button>
                <button
                    onClick={navigateToRegister}
                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
                >
                    Register
                </button>
            </div>
        </div>
    );
}
