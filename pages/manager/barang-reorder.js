import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";

const BarangReorder = () => {
    const [reorderList, setReorderList] = useState([]);
    const [userRole, setUserRole] = useState("manager");
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

    useEffect(() => {
        fetchReorderRequests();
    }, []);

    const fetchReorderRequests = async () => {
        const snapshot = await getDocs(collection(db, "reorder_requests"));
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setReorderList(data);
    };

    const updateStatus = async (id, status) => {
        const reorderRef = doc(db, "reorder_requests", id);
        await updateDoc(reorderRef, {
            status,
            tanggal_disetujui: Timestamp.now(),
        });

        alert(`Status reorder berhasil diubah menjadi ${status}`);

        if (status === "approved") {
            // Redirect ke halaman update stok
            router.push("/manager/update-stok?id=" + id); // sesuaikan halaman update
        } else {
            fetchReorderRequests(); // Tetap di halaman
        }
    };
    

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar role={userRole} />
            <div style={{ flex: 1, padding: "2rem" }}>
                <h1 className="text-2xl font-bold mb-4">Pengajuan Reorder Barang</h1>

                {reorderList.length === 0 ? (
                    <p className="text-gray-500">Belum ada pengajuan reorder.</p>
                ) : (
                    <div className="space-y-4">
                        {reorderList.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded p-4 shadow flex flex-col md:flex-row justify-between items-start md:items-center"
                            >
                                <div>
                                    <p className="font-semibold">{item.nama_barang}</p>
                                    <p className="text-sm text-gray-600">
                                        Stok Sekarang: {item.jumlah_sekarang} — Pengajuan:{" "}
                                        <strong>{item.jumlah_reorder}</strong>
                                    </p>
                                    {item.catatan && (
                                        <p className="text-sm italic text-gray-500">
                                            Catatan: {item.catatan}
                                        </p>
                                    )}
                                    <p className="text-sm mt-1 text-gray-400">
                                        Tanggal:{" "}
                                        {item.tanggal_pengajuan?.toDate().toLocaleString("id-ID")}
                                    </p>
                                    {item.tanggal_disetujui && (
                                        <p className="text-sm text-green-600">
                                            Disetujui:{" "}
                                            {item.tanggal_disetujui.toDate().toLocaleString("id-ID")}
                                        </p>
                                    )}
                                </div>
                                <div className="mt-3 md:mt-0">
                                    <p
                                        className={`text-sm font-bold mb-2 ${item.status === "approved"
                                            ? "text-green-600"
                                            : item.status === "rejected"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                            }`}
                                    >
                                        Status: {item.status}
                                    </p>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => updateStatus(item.id, "approved")}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(item.id, "rejected")}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarangReorder;
