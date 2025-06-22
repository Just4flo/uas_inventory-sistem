import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

export default function GrafikStok() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataBarang, setDataBarang] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            const storedRole = localStorage.getItem("role");
            if (!currentUser || storedRole !== "admin") {
                router.push("/login");
            } else {
                setUser(currentUser);
                setRole(storedRole);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await getDocs(collection(db, "stok_barang"));
                const data = snapshot.docs.map(doc => doc.data());
                setDataBarang(data);
            } catch (err) {
                console.error("Gagal ambil data:", err);
            }
        };

        if (!loading) {
            fetchData();
        }
    }, [loading]);

    if (loading) return <p className="p-6">Loading...</p>;

    const dataChart = dataBarang.map(item => ({
        name: item.nama_barang || "Tanpa Nama",
        stok: Number(item.jumlah) || 0
    }));

    return (
        <div className="flex min-h-screen">
            <Sidebar role={role} />
            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Grafik Stok Barang</h1>
                <div className="bg-white p-4 rounded shadow">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataChart}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="stok" fill="#3182ce" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
}
