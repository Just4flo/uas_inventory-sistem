import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    addDoc,
    Timestamp,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";

const NotifikasiReorder = () => {
    const [barangKurang, setBarangKurang] = useState([]);
    const [formReorder, setFormReorder] = useState({});
    const [userRole, setUserRole] = useState("staff");
    const [userId, setUserId] = useState(null);
    const [rejectedReorders, setRejectedReorders] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const role = localStorage.getItem("role");
                setUserRole(role);
                setUserId(user.uid); // simpan UID
                if (role !== "staff") {
                    router.replace("/unauthorized");
                }
            } else {
                router.replace("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (userId) {
            fetchBarangKurang();
            fetchRejectedReorders();
        }
    }, [userId]);

    const fetchBarangKurang = async () => {
        const q = collection(db, "stok_barang");
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setBarangKurang(data);
    };

    const fetchRejectedReorders = async () => {
        const q = query(
            collection(db, "reorder_requests"),
            where("status", "==", "rejected"),
            where("uid", "==", userId)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setRejectedReorders(data);
    };

    const handleChange = (id, field, value) => {
        setFormReorder((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (item) => {
        const auth = getAuth();
        const user = auth.currentUser;
        const reorderData = formReorder[item.id];

        if (!reorderData || !reorderData.jumlah_reorder) {
            alert("Mohon isi jumlah reorder.");
            return;
        }

        await addDoc(collection(db, "reorder_requests"), {
            uid: user.uid,
            nama_barang: item.nama_barang,
            jumlah_sekarang: item.jumlah,
            jumlah_reorder: parseInt(reorderData.jumlah_reorder),
            catatan: reorderData.catatan || "",
            tanggal_pengajuan: Timestamp.now(),
            status: "pending",
        });

        alert(`Reorder untuk ${item.nama_barang} berhasil diajukan.`);
        setFormReorder((prev) => ({ ...prev, [item.id]: {} }));
        fetchRejectedReorders(); // refresh daftar reorder ditolak
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar role={userRole} />

            <div style={{ flex: 1, padding: "2rem" }}>
                <h1 className="text-2xl font-bold mb-4">Form Notifikasi Reorder Barang</h1>

                {rejectedReorders.length > 0 && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded">
                        <h2 className="text-red-700 font-semibold mb-2">Reorder Ditolak:</h2>
                        <ul className="list-disc list-inside text-red-700">
                            {rejectedReorders.map((item) => (
                                <li key={item.id}>
                                    {item.nama_barang} - Jumlah diajukan: {item.jumlah_reorder} | Catatan: {item.catatan || "Tidak ada catatan"}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {barangKurang.length === 0 ? (
                    <p className="text-green-600">Semua stok aman. Tidak ada barang yang perlu direorder.</p>
                ) : (
                    <div className="space-y-6">
                        {barangKurang.map((item) => (
                            <div key={item.id} className="p-4 border rounded shadow">
                                <h2 className="font-semibold text-lg mb-2">
                                    {item.nama_barang} ({item.jumlah} {item.satuan})
                                </h2>

                                <div className="mb-2">
                                    <label className="block text-sm font-medium">Jumlah Reorder</label>
                                    <input
                                        type="number"
                                        className="border p-2 w-full"
                                        value={formReorder[item.id]?.jumlah_reorder || ""}
                                        onChange={(e) =>
                                            handleChange(item.id, "jumlah_reorder", e.target.value)
                                        }
                                        min="1"
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="block text-sm font-medium">Catatan</label>
                                    <textarea
                                        className="border p-2 w-full"
                                        rows="2"
                                        placeholder="Contoh: segera dibutuhkan"
                                        value={formReorder[item.id]?.catatan || ""}
                                        onChange={(e) =>
                                            handleChange(item.id, "catatan", e.target.value)
                                        }
                                    />
                                </div>

                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => handleSubmit(item)}
                                >
                                    Ajukan Reorder
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotifikasiReorder;
