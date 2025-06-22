import { useRouter } from "next/router"; // Import useRouter untuk memeriksa route saat ini
import Navbar from "../components/Navbar"; // Pastikan path-nya benar
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Daftar halaman yang hanya ingin menampilkan Navbar, misalnya "/index" dan "/contact"
  const navbarPages = ["/", "/login", "/contact"];  // Halaman yang menampilkan Navbar

  // Menentukan apakah halaman saat ini ada dalam daftar halaman yang menampilkan Navbar
  const showNavbar = navbarPages.includes(router.pathname);

  return (
    <div>
      {showNavbar && <Navbar />} {/* Navbar hanya ditampilkan jika di halaman index atau contact */}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
