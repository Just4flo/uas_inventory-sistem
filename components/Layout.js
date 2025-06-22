import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children, role }) {
    return (
        <div className="flex min-h-screen">
            {role && <Sidebar role={role} />}
            <div className="flex-1 flex flex-col">
                <Navbar role={role} />
                <main className="flex-1 p-6 bg-gray-100">{children}</main>
            </div>
        </div>
    );
}
