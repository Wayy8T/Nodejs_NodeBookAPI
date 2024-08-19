const user = require('./user')
import auth from './auth'
import { notFound } from '../middleware/handle_error'
import insert from './insert'

const initToutes = (app) => {
    app.use('/api/v1/user', user)
    app.use('/api/v1/auth', auth)
    app.use('/api/v1/insert', insert)

    return app.use('/', notFound)
}

module.exports = initToutes