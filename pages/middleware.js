import { auth } from "@/lib/firebase-admin"; // gunakan admin SDK
import { getDoc, doc } from "firebase-admin/firestore";

export async function getServerSideProps(context) {
    const { req, res } = context;
    const token = req.cookies.__session;

    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const role = userSnap.data().role;

        if (role !== "admin") {
            return {
                redirect: {
                    destination: "/unauthorized",
                    permanent: false,
                },
            };
        }

        return {
            props: {}, // akses aman
        };
    } catch (error) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
}
