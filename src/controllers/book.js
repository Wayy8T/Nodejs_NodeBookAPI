import * as service from "../services";
import { interalServerError, badRequest } from "../middleware/handle_error"


export const getBooks = async (req, resp) => {
    try {
        // client gui len parameter thi .query 
        // cleint ma gui data body cua put thi lay .body
        const respone = await service.getBooks(req.query)
        return resp.status(200).json(respone)

    } catch (error) {
        return interalServerError(req, resp)
    }
}