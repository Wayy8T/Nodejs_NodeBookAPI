import createError from 'http-errors'
export const badRequest = (err, respond) => {
    const error = createError.BadRequest(err)
    return respond.status(error.status).json({
        err: 1,
        mes: error.message
    })
}

export const interalServerError = (respond) => {
    const error = createError.interalServerError()
    return respond.status(error.status).json({
        err: 1,
        mes: error.message
    })
}