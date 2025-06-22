import { useRouter } from "next/router";
import Layout from "../../components/Layout";

// Hardcoded product list
const products = [
    { id: "1", name: "Produk A", description: "Deskripsi A", price: 100 },
    { id: "2", name: "Produk B", description: "Deskripsi B", price: 200 },
    { id: "3", name: "Produk C", description: "Deskripsi C", price: 300 },
];

export default function ProductDetail({ product, role }) {
    if (!product) return <p>Produk tidak ditemukan.</p>;

    return (
        <Layout role={role}>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-xl font-semibold">Harga: Rp {product.price}</p>
        </Layout>
    );
}

export async function getStaticPaths() {
    const paths = products.map((p) => ({ params: { id: p.id } }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const product = products.find((p) => p.id === params.id);
    const role = ""; // Ganti dengan logic ambil role (contoh: dari localStorage)
    return { props: { product: product || null, role } };
}
