import * as service from "../services";

export const register = async (req, resp) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return resp.status(400).json({
                err: 1,
                mes: 'Missing payloads'
            })
        }

        const respone = await service.register(req.body)

        return resp.status(200).json(respone)
    } catch (error) {
        return resp.status(500).json({
            err: -1,
            mes: 'Internal Server Error'
        })
    }
}


export const login = async (req, resp) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return resp.status(400).json({
                err: 1,
                mes: 'Missing payloads'
            })
        }

        const respone = await service.login(req.body)

        return resp.status(200).json(respone)
    } catch (error) {
        return resp.status(500).json({
            err: -1,
            mes: 'Internal Server Error'
        })
    }
}