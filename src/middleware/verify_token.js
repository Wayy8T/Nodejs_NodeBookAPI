import jwt from 'jsonwebtoken'
import { notAuth } from './handle_error'

const verifyToken = (req, resp, next) => {
    const token = req.headers.authorization
    if (!token) return notAuth('Require authorization', resp)
    // get token, use the split function to separate(chia, tách) the array, then get the second value in the array
    const accessToken = token.split(' ')[1]
    // verify token
    // the verify function will be transmitted 3 parameter
    // parameter accessToken: current token code
    // process.env.JWT_SECRET
    // and callback function with two parameter (err, user), if there is no error then convert the token to the original object 
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return notAuth('access token may be expired or invalid', resp)
        }
        req.user = user
        next()
    })
}

export default verifyToken