export const config = {
  runtime: 'nodejs',
};
import { auth, firestore } from "../../lib/firebase"; // Firebase configuration import

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password, role } = req.body;

        try {
            // Memeriksa apakah email sudah terdaftar dengan Firebase Authentication
            const methods = await auth.fetchSignInMethodsForEmail(email);
            if (methods.length > 0) {
                // Jika email sudah terdaftar, beri respons error
                return res.status(400).json({ success: false, message: "Email is already in use" });
            }

            // Mendaftar pengguna menggunakan Firebase Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);

            // Ambil data pengguna yang baru dibuat
            const user = userCredential.user;

            // Simpan data pengguna ke Firestore dengan role
            await firestore.collection("users").doc(user.uid).set({
                email: user.email,
                role: role, // Menyimpan role (Admin, Staff, Manager, dll)
                createdAt: new Date(),
            });

            return res.status(200).json({ success: true, message: "User registered successfully" });
        } catch (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}
