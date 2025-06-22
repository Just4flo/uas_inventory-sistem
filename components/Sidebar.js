import { useRouter } from "next/router";
import {
    FaBox,
    FaChartLine,
    FaBell,
    FaClipboardList,
    FaThList,
    FaWarehouse,
    FaSignOutAlt,
} from "react-icons/fa";
import { auth } from "../lib/firebase";
import { destroyCookie } from "nookies";

const Sidebar = ({ role }) => {
    const router = useRouter();


    const handleLogoutRedirect = () => {
        router.push("/logout");
    };

    const navigateToDashboard = () => {
        const dashboards = {
            admin: "/admin/admin-dashboard",
            manager: "/manager/manager-dashboard",
            staff: "/staff/staff-dashboard",
        };
        router.push(dashboards[role] || "/");
    };

    // Utility button class
    const btnClass =
        "flex items-center w-full text-left px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-200 text-white";

    return (
        <div className="w-64 bg-gray-800 text-white p-6 min-h-screen flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Inventory System</h2>
            <ul className="space-y-3 flex-grow">
                {/* Dashboard */}
                <li>
                    <button onClick={navigateToDashboard} className={btnClass}>
                        <FaBox className="mr-2" />
                        Dashboard
                    </button>
                </li>

                {/* ADMIN */}
                {role === "admin" && (
                    <>
                        <li>
                            <button onClick={() => router.push("/admin/grafik-stok")} className={btnClass}>
                                <FaChartLine className="mr-2" />
                                Grafik Stok
                            </button>
                        </li>
                        <li>
                            <button onClick={() => router.push("/admin/kategori-barang")} className={btnClass}>
                                <FaChartLine className="mr-2" />
                                Grafik Kategori
                            </button>
                        </li>
                        <li>
                            <button onClick={() => router.push("/admin/daftar-barang")} className={btnClass}>
                                <FaWarehouse className="mr-2" />
                                Daftar Barang
                            </button>
                        </li>
                        <li>
                            <button onClick={() => router.push("/admin/supplier")} className={btnClass}>
                                <FaWarehouse className="mr-2" />
                                Supplier
                            </button>
                        </li>
                    </>
                )}

                {/* MANAGER */}
                {role === "manager" && (
                    <>
                        <li>
                            <button onClick={() => router.push("/manager/grafik-stok")} className={btnClass}>
                                <FaChartLine className="mr-2" />
                                Grafik Stok
                            </button>
                        </li>
                        <li>
                            <button onClick={() => router.push("/manager/laporan-mingguan")} className={btnClass}>
                                <FaClipboardList className="mr-2" />
                                Laporan Mingguan
                            </button>
                        </li>
                        <li>
                            <button onClick={() => router.push("/manager/barang-reorder")} className={btnClass}>
                                <FaBell className="mr-2" />
                                Barang Reorder
                            </button>
                        </li>
                        <li>
                            <button onClick={() => router.push("/manager/update-stok")} className={btnClass}>
                                <FaBox className="mr-2" />
                                Update Stok
                            </button>
                        </li>
                        <li>
                            <button onClick={() => router.push("/manager/supplier")} className={btnClass}>
                                <FaWarehouse className="mr-2" />
                                Supplier
                            </button>
                        </li>
                    </>
                )}

                {/* STAFF */}
                {role === "staff" && (
                    <>
                        <li>
                            <button onClick={() => router.push("/staff/input-stok")} className={btnClass}>
                                <FaClipboardList className="mr-2" />
                                Input Barang
                            </button>
                        </li>
                        <li>
                            <button onClick={() => router.push("/staff/laporan")} className={btnClass}>
                                <FaChartLine className="mr-2" />
                                Laporan
                            </button>
                        </li>
                        <li>
                            <button onClick={() => router.push("/staff/notifikasi")} className={btnClass}>
                                <FaBell className="mr-2" />
                                Notifikasi
                            </button>
                        </li>
                        <li>
                            <button onClick={() => router.push("/staff/notifikasi-reorder")} className={btnClass}>
                                <FaBell className="mr-2" />
                                Notifikasi Reorder
                            </button>
                        </li>
                    </>
                )}
            </ul>

            {/* Logout */}
            <div className="mt-auto">
                <button
                    onClick={handleLogoutRedirect}
                    className="flex items-center w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition duration-200"
                >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
