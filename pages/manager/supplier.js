import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";

const FormSupplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [userRole, setUserRole] = useState(null);
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
        if (userRole === "manager") {
            fetchSuppliers();
        }
    }, [userRole]);

    const fetchSuppliers = async () => {
        const q = collection(db, "supplier");
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setSuppliers(data);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar role={userRole} />

            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Daftar Supplier</h1>

                {suppliers.length === 0 ? (
                    <p>Tidak ada data supplier.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2 text-left">Nama Supplier</th>
                                    <th className="border p-2 text-left">Alamat</th>
                                    <th className="border p-2 text-left">No. HP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-gray-50">
                                        <td className="border p-2">{supplier.nama_supplier}</td>
                                        <td className="border p-2">{supplier.alamat}</td>
                                        <td className="border p-2">{supplier.no_hp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormSupplier;
