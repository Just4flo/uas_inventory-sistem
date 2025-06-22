import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../components/Sidebar";
import "../../lib/firebase"; // pastikan Firebase sudah diinisialisasi

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            const storedRole = localStorage.getItem("role");

            if (!currentUser || storedRole !== "admin") {
                router.push("/login"); // redirect jika belum login atau bukan admin
            } else {
                setUser(currentUser);
                setRole(storedRole);
                setLoading(false);
            }
        });

        return () => unsubscribe(); // cleanup listener
    }, [auth, router]);

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="flex min-h-screen">
            <Sidebar role={role} />

            <div className="flex-1 p-6">
                <h1 className="text-3xl font-semibold mb-4">Dashboard Admin</h1>

                <p>Welcome, {user.email}</p>
                <p>Your Role: {role}</p>

                {role === "admin" && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold">Admin Access</h2>
                        <p className="text-gray-700">
                            As an admin, you can manage users, products, and settings.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
