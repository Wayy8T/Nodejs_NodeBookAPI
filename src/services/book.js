import db from '../models'
import { Op } from 'sequelize'
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
            ...queries
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