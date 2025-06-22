import { useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        const doLogout = async () => {
            await signOut(auth);
            localStorage.removeItem("role"); // bersihkan role
            router.replace("/login");
        };

        doLogout();
    }, [router]);

    return <p>Logging out...</p>;
}
