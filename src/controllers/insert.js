import * as service from "../services";
import { interalServerError, badRequest } from "../middleware/handle_error"


export const insertData = async (req, resp) => {
    try {

        const respone = await service.insertData()
        return resp.status(200).json(respone)

    } catch (error) {
        return interalServerError(req, resp)
    }
}