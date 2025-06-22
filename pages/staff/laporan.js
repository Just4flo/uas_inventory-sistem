import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function Laporan() {
    const [userRole, setUserRole] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        return onAuthStateChanged(auth, user => {
            if (user) {
                const role = localStorage.getItem('role');
                setUserRole(role);
                if (role !== 'staff') {
                    router.replace('/');
                }
            } else {
                router.replace('/login');
            }
        });
    }, [router]);

    const fetchReport = async (e) => {
        e.preventDefault();
        if (!fromDate || !toDate) return;

        const fromTs = Timestamp.fromDate(new Date(fromDate + 'T00:00:00'));
        const toTs = Timestamp.fromDate(new Date(toDate + 'T23:59:59'));

        const q = query(
            collection(db, 'stok_barang'),
            where('tanggal_masuk', '>=', fromTs),
            where('tanggal_masuk', '<=', toTs)
        );

        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            tanggal_masuk: d.data().tanggal_masuk.toDate().toLocaleString()
        }));

        setReportData(data);
    };

    if (!userRole) return <p>Loading...</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar role={userRole} />

            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">Laporan Input Stok</h1>

                <form onSubmit={fetchReport} className="flex flex-wrap gap-4 mb-6">
                    <div>
                        <label>From:</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label>To:</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Tampilkan
                    </button>
                </form>

                <div className="overflow-x-auto bg-white p-4 rounded shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2">Tanggal Masuk</th>
                                <th className="p-2">Nama Barang</th>
                                <th className="p-2">Kategori</th>
                                <th className="p-2">Jumlah</th>
                                <th className="p-2">Satuan</th>
                                <th className="p-2">Supplier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.length > 0 ? (
                                reportData.map(item => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-2">{item.tanggal_masuk}</td>
                                        <td className="p-2">{item.nama_barang}</td>
                                        <td className="p-2">{item.kategori}</td>
                                        <td className="p-2">{item.jumlah}</td>
                                        <td className="p-2">{item.satuan}</td>
                                        <td className="p-2">{item.supplier}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="p-4 text-center" colSpan="6">
                                        Belum ada data.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
