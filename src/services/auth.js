import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



const hashPassword = (password) => { return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) }

// function hashPassword(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// }

export const register = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        // sign up
        // check email da ton tai hay chua
        // function() findOrCreate() will return in two value [usser, create ]
        // the first: Check email, if email exists then => create return false
        // if email not exists then create return true and create email with User in database and return an array containing two values 
        const respone = await db.User.findOrCreate({
            where: { email },
            defaults: {
                email,
                password: hashPassword(password)
            }
        })

        // console.log(respone[0].email)
        // if sing up and not exxists
        const token = respone[1] ? jwt.sign({ id: respone[0].id, email: respone[0].email, role_code: respone[0].role_code }, process.env.JWT_SECRET, { expiresIn: '5d' }) : null

        resolve({
            err: respone[1] ? 0 : 1,
            mes: respone[1] ? 'Register is successfully' : "Email is used",
            'access_token': `Bearer ${token}`
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


// export function() login
export const login = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {

        const respone = await db.User.findOne({
            where: { email },
            raw: true
        })
        // console.log(respone)
        // create a isChecking variable used to check a respond variable, if have respond variable then decryption and compare two password 
        const isChecking = respone && bcrypt.compareSync(password, respone.password)
        const token = isChecking ? jwt.sign({ id: respone.id, email: respone.email, role_code: respone.role_code }, process.env.JWT_SECRET, { expiresIn: '5d' }) : null

        resolve({
            err: token ? 0 : 1,
            mes: token ? 'Login is successfully' : respone ? 'Password is wrong' : 'email has been registered',
            'access_token': token ? `Bearer ${token}` : token
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