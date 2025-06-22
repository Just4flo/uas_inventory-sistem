import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import Sidebar from "@/components/Sidebar";

export default function Supplier() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const [namaSupplier, setNamaSupplier] = useState("");
    const [noHp, setNoHp] = useState("");
    const [alamat, setAlamat] = useState("");
    const [dataSupplier, setDataSupplier] = useState([]);

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

    const fetchSuppliers = async () => {
        const snapshot = await getDocs(collection(db, "supplier"));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDataSupplier(list);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!namaSupplier || !noHp || !alamat) {
            alert("Semua field wajib diisi!");
            return;
        }

        try {
            await addDoc(collection(db, "supplier"), {
                nama_supplier: namaSupplier,
                no_hp: noHp,
                alamat: alamat
            });

            setNamaSupplier("");
            setNoHp("");
            setAlamat("");
            fetchSuppliers();
        } catch (err) {
            console.error("Gagal menambah supplier:", err);
        }
    };

    useEffect(() => {
        if (!loading) fetchSuppliers();
    }, [loading]);

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="flex min-h-screen">
            <Sidebar role={role} />
            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Form Supplier</h1>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4 mb-8">
                    <div>
                        <label className="block font-semibold">Nama Supplier</label>
                        <input
                            type="text"
                            value={namaSupplier}
                            onChange={(e) => setNamaSupplier(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Nomor HP</label>
                        <input
                            type="text"
                            value={noHp}
                            onChange={(e) => setNoHp(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Alamat</label>
                        <textarea
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Simpan
                    </button>
                </form>

                <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Daftar Supplier</h2>
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 border">No</th>
                                <th className="p-2 border">Nama</th>
                                <th className="p-2 border">No HP</th>
                                <th className="p-2 border">Alamat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataSupplier.map((item, index) => (
                                <tr key={item.id} className="text-center">
                                    <td className="p-2 border">{index + 1}</td>
                                    <td className="p-2 border">{item.nama_supplier}</td>
                                    <td className="p-2 border">{item.no_hp}</td>
                                    <td className="p-2 border">{item.alamat}</td>
                                </tr>
                            ))}
                            {dataSupplier.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">Belum ada supplier</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
