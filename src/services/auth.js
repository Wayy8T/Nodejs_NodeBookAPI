import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { where } from 'sequelize'
import { notAuth } from '../middleware/handle_error'



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
        const accessToken = respone[1] ? jwt.sign({ id: respone[0].id, email: respone[0].email, role_code: respone[0].role_code }, process.env.JWT_SECRET, { expiresIn: '5s' }) : null
        // JWT_SECRET_REFRESH_TOKEN
        const refreshToken = respone[1] ? jwt.sign({ id: respone[0].id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '17d' }) : null

        resolve({
            err: respone[1] ? 0 : 1,
            mes: respone[1] ? 'Register is successfully' : "Email is used",
            'access_token': accessToken ? `Bearer ${accessToken}` : accessToken,
            'refresh_token': refreshToken
        })
        if (refreshToken) {
            await db.User.update({
                refresh_token: refreshToken
            }, {
                where: { id: respone[0].id }
            })
        }
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
        const token = isChecking ? jwt.sign({ id: respone.id, email: respone.email, role_code: respone.role_code }, process.env.JWT_SECRET, { expiresIn: '5s' }) : null
        // JWT_SECRET_REFRESH_TOKEN
        const refreshToken = isChecking ? jwt.sign({ id: respone.id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '60s' }) : null

        resolve({
            err: token ? 0 : 1,
            mes: token ? 'Login is successfully' : respone ? 'Password is wrong' : 'email has been registered',
            'access_token': token ? `Bearer ${token}` : token,
            'refresh_token': refreshToken
        })
        if (refreshToken) {
            await db.User.update({
                refresh_token: refreshToken
            }, {
                where: { id: respone.id }
            })
        }
    } catch (error) {
        reject(error)
    }
})

export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({
            where: {
                refresh_token
            }
        })
        if (respone) {
            jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err, decode) => {
                if (err) {
                    resolve({
                        err: 1,
                        mess: 'RefreshToekn is expired. Require login'
                    })

                } else {
                    const accessToken = jwt.sign({ id: user.id, email: user.email, role_code: user.role_code }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '5s' })
                    resolve({
                        err: accessToken ? 0 : 1,
                        mess: accessToken ? "AccessToken is create successfull" : "AccessToken is create fail",
                        'accessToekn': accessToken ? `Bearer ${accessToken}` : accessToken,
                        'refresh_token': refresh_token
                    })
                }
            })
        }
    } catch (error) {
        reject(error)
    }
})