const user = require('./user')
import auth from './auth'
import { notFound } from '../middleware/handle_error'
import insert from './insert'
import book from './book'
const initToutes = (app) => {
    app.use('/api/v1/user', user)
    app.use('/api/v1/auth', auth)
    app.use('/api/v1/insert', insert)
    app.use('/api/v1/book', book)

    return app.use('/', notFound)
}

module.exports = initToutes