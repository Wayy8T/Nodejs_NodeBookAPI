const user = require('./user')
import auth from './auth'

const initToutes = (app) => {
    app.use('/api/v1/user', user)
    app.use('/api/v1/auth', auth)

    return app.use('/', (req, resp) => {
        return resp.send('Server on')
    })
}

module.exports = initToutes