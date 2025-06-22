import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../../lib/firebase';
import {
    collection,
    addDoc,
    Timestamp,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import Sidebar from "../../components/Sidebar";

export default function InputStok() {
    const [formData, setFormData] = useState({
        nama_barang: '',
        kategori: '',
        jumlah: '',
        satuan: '',
        supplier: '',
        image: null,
    });

    const [supplierList, setSupplierList] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const role = localStorage.getItem("role");
                setUserRole(role);

                if (role !== 'staff') {
                    router.replace('/unauthorized');
                }
            } else {
                router.replace('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Ambil data supplier
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'supplier'));
                const suppliers = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSupplierList(suppliers);
            } catch (err) {
                console.error("Gagal mengambil data supplier:", err);
            }
        };

        fetchSuppliers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Gagal upload. Status: ${response.status}. Respon: ${text}`);
        }

        const data = await response.json();
        return data.url;
    };
      
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const q = query(
                collection(db, 'stok_barang'),
                where("nama_barang", "==", formData.nama_barang),
                where("kategori", "==", formData.kategori)
            );

            const existing = await getDocs(q);

            if (!existing.empty) {
                alert("Barang dengan nama dan kategori ini sudah ada!");
                return;
            }

            let imageUrl = '';
            if (formData.image) {
                imageUrl = await uploadImageToCloudinary(formData.image);
            }

            await addDoc(collection(db, 'stok_barang'), {
                nama_barang: formData.nama_barang,
                kategori: formData.kategori,
                jumlah: parseInt(formData.jumlah),
                satuan: formData.satuan,
                supplier: formData.supplier,
                tanggal_masuk: Timestamp.now(),
                gambar: imageUrl, // simpan URL gambar ke Firestore
            });

            alert('Stok berhasil ditambahkan!');
            setFormData({
                nama_barang: '',
                kategori: '',
                jumlah: '',
                satuan: '',
                supplier: '',
                image: null,
            });

        } catch (err) {
            console.error('Gagal tambah stok:', err);
            alert('Gagal menambahkan stok');
        }
    };

    if (!userRole) return <p>Memuat halaman...</p>;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <Sidebar role={userRole} />

            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Input Barang</h1>

                <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="nama_barang"
                            value={formData.nama_barang}
                            onChange={handleChange}
                            placeholder="Nama Barang"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Pilih Kategori --</option>
                            <option value="elektronik">Elektronik</option>
                            <option value="aksesoris">Aksesoris</option>
                            <option value="printilan">Printilan</option>
                        </select>

                        <input
                            name="jumlah"
                            type="number"
                            value={formData.jumlah}
                            onChange={handleChange}
                            placeholder="Jumlah"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            name="satuan"
                            value={formData.satuan}
                            onChange={handleChange}
                            placeholder="Satuan (pcs, liter, dll)"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Select Supplier dari database */}
                        <select
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Pilih Supplier --</option>
                            {supplierList.map((sup) => (
                                <option key={sup.id} value={sup.nama_supplier}>
                                    {sup.nama_supplier}
                                </option>
                            ))}
                        </select>

                        {/* Input file gambar */}
<input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
<p className="text-sm text-gray-500 mt-1">Gambar tidak boleh lebih dari 2 MB</p>


                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                        >
                            Simpan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
