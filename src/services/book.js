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

// UPDATE 
export const updateBook = ({ bookId, ...body }, fileDataImage) => new Promise(async (resolve, reject) => {
    try {
        // an update function accepts two object 
        // object 1 là những cái cần sửa :D
        // Object 2 is used to find where data is in the database. 
        // An update function returns an array, and in the array, it returns the count of updated records.
        if (fileDataImage) {
            body.image = fileDataImage?.path
        }
        const respone = await db.Book.update(body, {
            where: { id: bookId }
        })
        resolve({
            err: respone[0] > 0 ? 0 : 1,
            mes: respone[0] > 0 ? `${respone[0]} book updated` : "BookId not found"
        })
        // lỗi thì xóa ảnh
        if (fileDataImage && respone[0] === 0) {
            cloudinary.v2.uploader.destroy(fileDataImage.filename)
            console.log('Image is deleted')
        }
    } catch (error) {
        reject(error)
        if (fileDataImage)
            cloudinary.v2.uploader.destroy(fileDataImage.filename)
    }
})



function deleteImageCloudinary(imageUrl) {
    // Extract the public_id from the URL
    console('delete image1')
    const urlParts = imageUrl.split('/');
    console('delete image2')
    const publicIdWithExtension = urlParts.slice(-2).join('/'); // 'v1629309123/sample_image.jpg'
    console('delete image3')
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // Remove the file extension

    // Delete the image
    cloudinary.uploader.destroy(publicId, function (error, result) {
        if (error) {
            console.error('Error deleting image:', error);
        } else {
            console.log('Image deleted successfully:', result);
        }
    });
}

// DELETE 
export const deletedBook = ({ bookId, ...body }) => new Promise(async (resolve, reject) => {
    try {
        const getOneBook = await db.Book.findOne({
            where: { id: bookId },
        })
        console.log('get Book')
        console.log(getOneBook)
        const image = getOneBook.image
        const respone = await db.Book.destroy({ where: { id: bookId } });
        // deleteBook is now in the database
        resolve({
            // err: countDelete > 0 ? deleteImageCloudinary(body.path) : 1,
            err: respone > 0 ? deleteImageCloudinary(image) : 1,
            mes: respone > 0 ? `${respone} book is deleted` : "BookId not found"
        })
    } catch (error) {
        reject(error)
    }
})

