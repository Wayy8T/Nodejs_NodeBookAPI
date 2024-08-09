const user = require('./user')
import auth from './auth'
import { notFound } from '../middleware/handle_error'

const initToutes = (app) => {
    app.use('/api/v1/user', user)
    app.use('/api/v1/auth', auth)

    return app.use('/', notFound)
}

module.exports = initToutes