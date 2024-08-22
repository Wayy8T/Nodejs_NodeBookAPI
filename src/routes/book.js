import { isAdmin, isModeratorAdmin } from '../middleware/verify_roles'
import * as controller from '../controllers'
import express from 'express'
import verifyToken from '../middleware/verify_token'
import uploadCloud from '../middleware/uploadCloudinary'
const router = express.Router()
// public route
router.get('/getbook', controller.getBooks)

// private route

router.use(verifyToken)
router.use(isAdmin)
// khi post thì có file ảnh => Đứng trước create để lấy ảnh upload lên cloud
// uploadCloud.singer: Up 1 ảnh, uploadCloud.field: Up nhiều ảnh ở nhiều trường, uploadCloud.array: 1 key up n ảnh 
// image là key của chứa file ảnh ( model book )
router.post('/', uploadCloud.single('image'), controller.createNewBooks)

module.exports = router


// NOTE
// khi create new book thì sẽ up ảnh luôn => Sử dụng multer storage tại đây