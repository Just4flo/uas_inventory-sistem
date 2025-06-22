import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // jika kamu pakai NextAuth (bisa skip jika tidak)
import { auth } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Bypass public pages
    const publicPaths = ["/login", "/register", "/"];
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // Ambil token Firebase dari cookie atau sesi
    const token = req.cookies.get("__session")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        // Verifikasi token dan ambil user info
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        // Ambil role dari Firestore
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const role = userSnap.data().role;

        // Cek role dan validasi akses berdasarkan URL
        if (pathname.startsWith("/admin") && role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (pathname.startsWith("/manager") && role !== "manager") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (pathname.startsWith("/staff") && role !== "staff") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Semua kondisi lolos
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error.message);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// Middleware akan aktif di rute tertentu
export const config = {
    matcher: [
        "/admin/:path*",
        "/manager/:path*",
        "/staff/:path*",
    ],
};
