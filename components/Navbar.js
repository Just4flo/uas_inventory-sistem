import { useState } from "react";
import Link from "next/link";
import { FaHome, FaSignInAlt, FaBars, FaTimes, FaAddressBook } from "react-icons/fa";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-blue-500 p-4 shadow-md">
            <div className="flex justify-between items-center container mx-auto">
                {/* Logo */}
                <div className="text-white text-2xl font-bold">Inventory System</div>

                {/* Navbar untuk layar besar */}
                <div className="hidden md:flex space-x-6">
                    <Link href="/" className="text-white hover:text-gray-300 flex items-center text-xl transition">
                        <FaHome className="mr-2" /> Home
                    </Link>
                    <Link href="/contact" className="text-white hover:text-gray-300 flex items-center text-xl transition">
                        <FaAddressBook className="mr-2" /> Contact
                    </Link>
                    <Link href="/login" className="text-white hover:text-gray-300 flex items-center text-xl transition">
                        <FaSignInAlt className="mr-2" /> Login
                    </Link>
                </div>

                {/* Menu Hamburger untuk layar kecil */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white text-2xl focus:outline-none">
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Dropdown Menu untuk layar kecil (animated slide-down) */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-40" : "max-h-0"
                    } bg-blue-500`}
            >
                <Link href="/" className="block text-white hover:text-gray-300 py-2 px-4 flex items-center text-xl">
                    <FaHome className="mr-2" /> Home
                </Link>
                <Link href="/contact" className="block text-white hover:text-gray-300 py-2 px-4 flex items-center text-xl">
                    <FaAddressBook className="mr-2" /> Contact
                </Link>
                <Link href="/login" className="block text-white hover:text-gray-300 py-2 px-4 flex items-center text-xl">
                    <FaSignInAlt className="mr-2" /> Login
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
