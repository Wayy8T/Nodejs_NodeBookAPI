import createError from 'http-errors'

export const badRequest = (err, respond) => {
    const error = createError.BadRequest(err)
    return respond.status(error.status).json({
        err: 1,
        mes: error.message
    })
}

export const interalServerError = (req, resp) => {
    const error = createError.InternalServerError()
    return resp.status(error.status).json({
        err: 1,
        mes: error.message
    })
}

export const notFound = (req, resp) => {
    const error = createError.NotFound('This route is not defined')
    return resp.status(error.status).json({
        err: 1,
        mes: error.message
    })
}