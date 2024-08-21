import { isAdmin, isModeratorAdmin } from '../middleware/verify_roles'
import * as controller from '../controllers'
import express from 'express'
import verifyToken from '../middleware/verify_token'
const router = express.Router()
// public route
router.get('/getbook', controller.getBooks)



// private route
router.use(verifyToken)
router.use(isAdmin)
router.post('/', controller.createNewBooks)
module.exports = router