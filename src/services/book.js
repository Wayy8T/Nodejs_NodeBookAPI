import { defaults } from 'joi'
import db from '../models'
import { Op } from 'sequelize'
import { v4 as generateId } from 'uuid'
import cloudinary from 'cloudinary'

// CRUD voi book
export const getBooks = ({ page, limit, order, name, available, ...query }) => new Promise(async (resolve, reject) => {
    try {
        // raw:true ( ko lay instan cuar sequelize)
        // nest: true ( gom data cua bang khac thanh 1 object )
        const queries = { raw: true, nest: true }
        const offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const fLimit = +limit || +process.env.LIMIT_BOOK
        queries.offset = offset * fLimit
        queries.limit = fLimit
        // yeu cau sap xep ( DESC (giam), ASC (tang) ) 
        if (order) queries.order = [order]

        if (name) query.title = { [Op.substring]: name }

        // tim khoảng 
        if (available) query.available = { [Op.between]: available }
        console.log(query)
        // a findAndCountAll function use to:
        // + tim tất cả giá trị cần cho việc phân trang 
        // limit: 1 trang có tối đa bao nhiêu 
        // offset: Lượt bỏ ( bù ) bao nhiêu để trỏ đúng vào cuốn sách đầu tiên của trang đó
        const respone = await db.Book.findAndCountAll({
            where: query,
            ...queries,
            attributes: {
                exclude: ['category_code']
            },
            include: [
                {
                    // phuong phap association
                    // exclude: loại bỏ ko lấy những attribute trong mảng
                    model: db.Category, attributes: { exclude: ['createdAt', 'updatedAt'] }, as: 'category_data'
                }
            ]
        })

        resolve({
            err: respone ? 0 : 1,
            mes: respone ? 'Have a respone' : "Cannot found books",
            bookData: respone
        })
        resolve({
            err: 0,
            mes: 'register service'
        })
        console.log('after resolve')
    } catch (error) {
        reject(error)
    }
})

// CREATE 

export const createNewBook = (body, fileDataImage) => new Promise(async (resolve, reject) => {
    try {
        // nnếu sách đó đã có rồi thì ko tạo
        // nếu tên sách chưa có thì tạo mới bang findOrCreate
        // findOrCreate tìm trước rồi mới tạo

        // neu title = body.title thi ko tao nua, nguoc lai tao thei defaults 
        const respone = await db.Book.findOrCreate({
            // findOrCreate tra ve mang co 2 phan tu: Mang va boolean
            where: { title: body.title },
            defaults: {
                ...body,
                id: generateId()
            }
        })

        resolve({
            err: respone[1] ? 0 : 1,
            mes: respone[1] ? 'Created' : "Cannot create new book"
        })

        // lỗi thì xóa ảnh
        if (fileDataImage && !respone[1]) {
            cloudinary.v2.uploader.destroy(fileDataImage.filename)
            console.log('Image is deleted')
        }
    } catch (error) {
        reject(error)
        if (fileDataImage)
            cloudinary.v2.uploader.destroy(fileDataImage.filename)
    }
})
