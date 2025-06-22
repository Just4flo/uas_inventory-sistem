import nextConnect from 'next-connect';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Setup multer
const upload = multer({ storage: multer.memoryStorage() });

// Setup Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        console.error('Upload error:', error);
        res.status(500).json({ error: `Upload gagal: ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Metode ${req.method} tidak diizinkan` });
    },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'Tidak ada file yang diupload' });
    }

    try {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'produk' },
            (error, result) => {
                if (error) return res.status(500).json({ error: error.message });
                res.status(200).json({ url: result.secure_url });
            }
        );

        uploadStream.end(file.buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat upload' });
    }
});

// ✅ Gabungan config disini
export const config = {
  runtime: 'nodejs',
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
