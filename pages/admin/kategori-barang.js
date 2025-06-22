import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

export default function GrafikKategori() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataKategori, setDataKategori] = useState([]);

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
            const kategoriMap = {};

            const snapshot = await getDocs(collection(db, "stok_barang"));
            snapshot.forEach(doc => {
                const data = doc.data();
                const kategori = data.kategori;
                const jumlah = data.jumlah || 0;

                if (kategori) {
                    if (!kategoriMap[kategori]) {
                        kategoriMap[kategori] = jumlah;
                    } else {
                        kategoriMap[kategori] += jumlah;
                    }
                }
            });

            const dataChart = Object.entries(kategoriMap).map(([kategori, total]) => ({
                name: kategori,
                jumlah: total,
            }));

            setDataKategori(dataChart);
        };

        if (!loading) fetchData();
    }, [loading]);

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="flex min-h-screen">
            <Sidebar role={role} />
            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Grafik Jumlah per Kategori Barang</h1>
                <div className="bg-white p-4 rounded shadow">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataKategori}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="jumlah" fill="#3182CE" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
}
