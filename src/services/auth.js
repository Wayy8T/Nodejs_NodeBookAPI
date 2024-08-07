import db from '../models'
import bcrypt from 'bcryptjs'


const hashPassword = (password) => { return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) }

// function hashPassword(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// }

export const register = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        // dang ky
        // check email da ton tai hay chua
        const respone = await db.User.findOrCreate({
            where: { email },
            defaults: {
                email,
                password: hashPassword(password)
            }
        })
        console.log(respone)
        resolve({
            err: respone[1] ? 0 : 1,
            mes: respone[1] ? 'Register is successfully' : "Email is used"
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