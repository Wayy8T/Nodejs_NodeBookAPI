import * as service from "../services";
import { interalServerError, badRequest } from "../middleware/handle_error"
import { title, price, available, image, category_code } from "../helpers/joi_schema";
import Joi from "joi";


export const getBooks = async (req, resp) => {
    try {
        // client gui len parameter thi .query 
        // cleint ma gui data body cua put thi lay .body
        const response = await service.getBooks(req.query)
        return resp.status(200).json(response)

    } catch (error) {
        return interalServerError(req, resp)
    }
}

// CREATE

export const createNewBooks = async (req, resp) => {
    try {
        // validate
        // if (!req.body?.title || !req.body?.price || !req.body?.available || !req.body?.category_code || !req.body?.image) {
        //     return resp.status(400).json({
        //         err: 1,
        //         mes: 'Missing input'
        //     })
        // }
        // validate
        const { error } = Joi.object({ title, price, available, image, category_code }).validate(req.body)
        console.log('validate')
        // details là một thuộc tính của đối tượng error được trả về bởi phương thức validate của Joi.
        if (error) return badRequest(error.details[0].message, resp)
        console.log('validate1')
        const response = await service.createNewBook(req.body);

        console.log('validate3')

        return resp.status(200).json(response)
    } catch (error) {
        return interalServerError(req, resp)
    }
}