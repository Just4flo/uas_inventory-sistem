import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Import Sidebar secara dinamis (optimization)
const Sidebar = dynamic(() => import("@/components/Sidebar"), {
    ssr: false,
    loading: () => <div>Loading sidebar...</div>,
});

export default function DaftarBarang() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [barangList, setBarangList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        const fetchBarang = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "stok_barang"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBarangList(data);
            } catch (err) {
                console.error("Gagal ambil data barang:", err);
            }
        };

        if (!loading) {
            fetchBarang();
        }
    }, [loading]);

    if (loading) return <p className="p-6">Loading...</p>;

    // Pagination logic
    const totalPages = Math.ceil(barangList.length / itemsPerPage);
    const paginatedBarang = barangList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex min-h-screen">
            <Sidebar role={role} />
            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-6">Daftar Barang</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full border bg-white shadow-md rounded-lg">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="border p-3 text-left">No</th>
                                <th className="border p-3 text-left">Nama Barang</th>
                                <th className="border p-3 text-left">Kategori</th>
                                <th className="border p-3 text-center">Jumlah</th>
                                <th className="border p-3 text-center">Satuan</th>
                                <th className="border p-3 text-left">Supplier</th>
                                <th className="border p-3 text-center">Gambar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBarang.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="border p-3">{item.nama_barang}</td>
                                    <td className="border p-3">{item.kategori}</td>
                                    <td className="border p-3 text-center">{item.jumlah}</td>
                                    <td className="border p-3 text-center">{item.satuan}</td>
                                    <td className="border p-3">{item.supplier}</td>
                                    <td className="border p-3 text-center">
                                        {item.gambar ? (
                                            <img
                                                src={item.gambar + "?q_auto,f_auto,w_64,h_64,c_fill"} // Optimasi Cloudinary
                                                alt={item.nama_barang}
                                                loading="lazy"
                                                className="w-16 h-16 object-cover mx-auto rounded"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Tidak ada gambar</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {barangList.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">
                                        Tidak ada data barang
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Control */}
                <div className="mt-4 flex justify-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}
