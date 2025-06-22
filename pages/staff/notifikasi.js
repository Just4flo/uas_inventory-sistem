import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import Sidebar from '@/components/Sidebar';
import { db } from '../../lib/firebase'; // sesuaikan path sesuai struktur
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Notifikasi() {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        return onAuthStateChanged(auth, user => {
            if (user) {
                const role = localStorage.getItem('role');
                setUserRole(role);
                if (role !== 'staff') {
                    router.replace('/');
                } else {
                    fetchLowStock();
                }
            } else {
                router.replace('/login');
            }
        });
    }, [router]);

    const fetchLowStock = async () => {
        const snapshot = await getDocs(collection(db, 'stok_barang'));
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setLowStockItems(data.filter(item => item.jumlah < 20));
    };

    if (userRole !== 'staff') {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar role="staff" />

            <main className="flex-1 p-8 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Notifikasi Stok Rendah</h1>

                {lowStockItems.length > 0 ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        ⚠️ Ada {lowStockItems.length} barang dengan stok &lt; 20. Mohon segera restock!
                    </div>

                ) : (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        ✅ Semua stok cukup.
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-left">Nama Barang</th>
                                <th className="p-2 text-left">Jumlah</th>
                                <th className="p-2 text-left">Satuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockItems.map(item => (
                                <tr key={item.id} className="border-t bg-red-50">
                                    <td className="p-2">{item.nama_barang}</td>
                                    <td className="p-2 text-red-600 font-semibold">{item.jumlah}</td>
                                    <td className="p-2">{item.satuan}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
