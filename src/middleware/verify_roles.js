import { notAuth } from "./handle_error"

export const isAdmin = (req, resp, next) => {
    const { role_code } = req.user
    if (role_code !== 'R1') return notAuth('Require role Admin', resp)
    next()
}

export const isCreatorAdmin = (req, resp, next) => {
    const { role_code } = req.user
    if (role_code !== 'R1' && role_code !== 'R2') return notAuth('Require role Admin or Creator', resp)
    next()
}