export const config = {
  runtime: 'nodejs',
};
import { auth, db } from "../../lib/firebase"; // Perbaikan import

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        try {
            // Melakukan login dengan Firebase Authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, password);

            // Ambil data pengguna yang berhasil login
            const user = userCredential.user;

            // Ambil data role pengguna dari Firestore
const userDoc = await db.collection("users").doc(user.uid).get();


            if (!userDoc.exists) {
                return res.status(404).json({ success: false, message: "User data not found in Firestore" });
            }

            // Ambil role dari Firestore
            const role = userDoc.data().role;

            // Kirimkan token dan role sebagai respons
            return res.status(200).json({
                success: true,
                message: "Login successful",
                role: role,
                email: user.email,
                token: await user.getIdToken(), // Mengirimkan JWT token pengguna
            });
        } catch (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}
