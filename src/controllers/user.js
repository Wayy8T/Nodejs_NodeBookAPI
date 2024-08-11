import * as service from "../services";
import { interalServerError, badRequest } from "../middleware/handle_error"
// import { email, password } from "../helpers/joi_schema";
// import joi from 'joi'

export const getCurrent = async (req, resp) => {
    try {
        const { id } = req.user
        const respone = await service.getOne(id)
        return resp.status(200).json(respone)

    } catch (error) {
        return interalServerError(req, resp)
    }
}