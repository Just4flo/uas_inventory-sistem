import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // pastikan db diekspor juga dari firebase.js

export default function RedirectPage() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Ambil data role dari Firestore
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const role = docSnap.data().role;
                    localStorage.setItem("role", role); // simpan kalau mau

                    switch (role) {
                        case "admin":
                            router.replace("/admin/admin-dashboard");
                            break;
                        case "manager":
                            router.replace("/manager/manager-dashboard");
                            break;
                        case "staff":
                            router.replace("/staff/staff-dashboard");
                            break;
                        default:
                            router.replace("/");
                    }
                } else {
                    router.replace("/login");
                }
            } else {
                router.replace("/login");
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) return <p>Redirecting...</p>;
    return null;
}