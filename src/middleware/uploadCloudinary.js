
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    // khởi tạo storage và dùng thư tư viện multer-storage-cloudinary
    // stodinary
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        // folder muốn lưu vào
        folder: 'learn_nodejs'
    }
});

const uploadCloud = multer({ storage });

// export storage để sử dụng
// vào book ở thư mục route để xem tiếp
module.exports = uploadCloud;
