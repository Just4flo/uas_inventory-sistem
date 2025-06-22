// pages/staff/update-stok.js
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Sidebar from "../../components/Sidebar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

const UpdateStok = () => {
    const [stokList, setStokList] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ jumlah: "" });
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const role = localStorage.getItem("role");
                setUserRole(role);

                if (role !== "manager") {
                    router.replace("/unauthorized");
                } else {
                    await fetchStok(); // Hanya fetch data jika role benar
                    setLoading(false);
                }
            } else {
                router.replace("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    const fetchStok = async () => {
        const querySnapshot = await getDocs(collection(db, "stok_barang"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStokList(data);
    };

    const startEditing = (id, currentJumlah) => {
        setEditingId(id);
        setFormData({ jumlah: currentJumlah });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (id) => {
        try {
            await updateDoc(doc(db, "stok_barang", id), {
                jumlah: parseInt(formData.jumlah, 10),
                updated_at: Timestamp.now(),
            });
            setEditingId(null);
            await fetchStok();
        } catch (error) {
            console.error("Gagal update stok:", error);
        }
    };
    const handleDelete = async (id) => {
        const konfirmasi = confirm("Apakah kamu yakin ingin menghapus data ini?");
        if (!konfirmasi) return;

        try {
            await deleteDoc(doc(db, "stok_barang", id));
            await fetchStok();
        } catch (error) {
            console.error("Gagal menghapus stok:", error);
        }
    };

    if (loading) return <p>Memuat halaman...</p>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar role={userRole} />

            <div style={{ flex: 1, padding: '2rem' }}>
                <h1 className="text-2xl font-bold mb-4">Update Stok Barang</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-left">Nama Barang</th>
                                <th className="p-2 text-left">Kategori</th>
                                <th className="p-2 text-left">Jumlah</th>
                                <th className="p-2 text-left">Satuan</th>
                                <th className="p-2 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stokList.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-2">{item.nama_barang}</td>
                                    <td className="p-2">{item.kategori}</td>
                                    <td className="p-2">
                                        {editingId === item.id ? (
                                            <input
                                                name="jumlah"
                                                type="number"
                                                value={formData.jumlah}
                                                onChange={handleChange}
                                                className="border px-2 py-1 rounded"
                                            />
                                        ) : (
                                            item.jumlah
                                        )}
                                    </td>
                                    <td className="p-2">{item.satuan}</td>
                                    <td className="p-2 space-y-1">
                                        {editingId === item.id ? (
                                            <button
                                                onClick={() => handleUpdate(item.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded w-full"
                                            >
                                                Simpan
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => startEditing(item.id, item.jumlah)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded w-full"
                                            >
                                                Update
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full"
                                        >
                                            Hapus
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UpdateStok;
