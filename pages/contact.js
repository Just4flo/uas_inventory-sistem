import { FaEnvelope, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Contact() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
            <img
                src="/yudha.jpg"
                alt="Foto Yudha"
                className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mb-6 transition-transform duration-300 hover:scale-110 shadow-lg"
            />

            <h1 className="text-3xl md:text-4xl font-bold text-center">Yudha Purnama</h1>
            <p className="text-gray-600 text-center text-lg md:text-xl mt-2">
                Mahasiswa Semester 4, Universitas Masoem
            </p>
            <p className="text-center mt-1 text-base md:text-lg">Garut, Jawa Barat</p>

            {/* Social Icons */}
            <div className="flex space-x-6 mt-6">
                <a
                    href="mailto:yp03634@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 text-2xl"
                >
                    <FaEnvelope />
                </a>
                <a
                    href="https://instagram.com/masssssyud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-pink-500 text-2xl"
                >
                    <FaInstagram />
                </a>
                <a
                    href="https://linkedin.com/in/yuda purnama"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-700 text-2xl"
                >
                    <FaLinkedin />
                </a>
            </div>
        </div>
    );
}
