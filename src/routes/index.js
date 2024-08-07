const user = require('./user')

const initToutes = (app) => {
    app.use('/api/v1/user', user)

    return app.use('/', (req, resp) => {
        return resp.send('Server on')
    })
}

module.exports = initToutes