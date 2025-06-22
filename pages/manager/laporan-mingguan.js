import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";

const LaporanMingguan = () => {
    const [stokMingguan, setStokMingguan] = useState([]);
    const [userRole, setUserRole] = useState("manager");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const role = localStorage.getItem("role");
                setUserRole(role);
                if (role !== "manager") {
                    router.replace("/unauthorized");
                }
            } else {
                router.replace("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    const fetchLaporanMingguan = async () => {
        if (!startDate || !endDate) return;

        const start = Timestamp.fromDate(new Date(startDate));
        const end = Timestamp.fromDate(new Date(endDate + "T23:59:59"));

        const stokQuery = query(
            collection(db, "stok_barang"),
            where("updated_at", ">=", start),
            where("updated_at", "<=", end)
        );

        const querySnapshot = await getDocs(stokQuery);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStokMingguan(data);
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar role={userRole} />

            <div style={{ flex: 1, padding: "2rem" }}>
                <h1 className="text-2xl font-bold mb-4">Update Stok Mingguan</h1>

                <div className="flex items-center gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium">Tanggal Mulai</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tanggal Akhir</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                        />
                    </div>
                    <button
                        onClick={fetchLaporanMingguan}
                        className="bg-blue-600 text-white px-4 py-2 rounded mt-6"
                    >
                        Cari
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-left">Nama Barang</th>
                                <th className="p-2 text-left">Kategori</th>
                                <th className="p-2 text-left">Jumlah</th>
                                <th className="p-2 text-left">Satuan</th>
                                <th className="p-2 text-left">Tanggal Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stokMingguan.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-2">{item.nama_barang}</td>
                                    <td className="p-2">{item.kategori}</td>
                                    <td className="p-2">{item.jumlah}</td>
                                    <td className="p-2">{item.satuan}</td>
                                    <td className="p-2">
                                        {item.updated_at?.toDate().toLocaleDateString("id-ID")}
                                    </td>
                                </tr>
                            ))}
                            {stokMingguan.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">
                                        Tidak ada data stok ditemukan pada rentang tanggal tersebut.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LaporanMingguan;
