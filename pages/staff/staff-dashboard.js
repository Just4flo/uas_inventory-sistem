import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../components/Sidebar";
import "../../lib/firebase"; // pastikan kamu menginisialisasi firebase di file ini

const StaffDashboard = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            const storedRole = localStorage.getItem("role");

            if (!currentUser || storedRole !== "staff") {
                router.push("/login"); // redirect jika belum login atau bukan staff
            } else {
                setUser(currentUser);
                setRole(storedRole);
                setLoading(false);
            }
        });

        return () => unsubscribe(); // bersihkan listener saat unmount
    }, [auth, router]);

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="flex min-h-screen">
            <Sidebar role={role} />

            <div className="flex-1 p-6">
                <h1 className="text-3xl font-semibold mb-4">Dashboard Staff</h1>

                <p>Welcome, {user.email}</p>
                <p>Your Role: {role}</p>

                {role === "staff" && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold">Staff Access</h2>
                        <p className="text-gray-700">
                            As a staff member, you can view data and perform basic tasks.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;
