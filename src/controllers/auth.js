import * as service from "../services";
import { interalServerError, badRequest } from "../middleware/handle_error"
import { email, password, refreshToken } from "../helpers/joi_schema";
import joi from 'joi'

export const register = async (req, resp) => {
    try {
        // const { email, password } = req.body
        // if (!email || !password) {
        //     return resp.status(400).json({
        //         err: 1,
        //         mes: 'Missing payloads'
        //     })
        // }

        // check email and password
        // create error(schema) used for merging email and password into object before compare with function validate()

        const { error } = joi.object({ email, password }).validate(req.body)
        // check error
        if (error) return badRequest(error.details[0].message, resp);

        const respone = await service.register(req.body)

        return resp.status(200).json(respone)
    } catch (error) {
        return interalServerError(req, resp)
    }
}


export const login = async (req, resp) => {

    try {
        // const { email, password } = req.body
        // if (!email || !password) {
        //     return resp.status(400).json({
        //         err: 1,
        //         mes: 'Missing payloads'
        //     })
        // }
        const { error } = joi.object({ email, password }).validate(req.body)
        // check error
        if (error) return badRequest(error.details[0].message, resp);
        const respone = await service.login(req.body)

        return resp.status(200).json(respone)
    } catch (error) {
        return interalServerError(req, resp)
    }
}


export const refreshTokenController = async (req, resp) => {

    try {
        const { error } = joi.object({ refreshToken }).validate(req.body)
        if (error) return badRequest(error.details[0].message, resp);
        const respone = await service.refreshToken(req.body.refreshToken)

        return resp.status(200).json(respone)
    } catch (error) {
        return interalServerError(req, resp)
    }
}