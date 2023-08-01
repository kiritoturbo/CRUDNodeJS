import * as services from "../services"
import { internalServerError,badRequest } from "../middlewares/handle_erros";
// import {email,password} from "../helpers/joi_schema";
// import joi from 'joi'

export const insertData = async(req,res)=>{
    // console.log(await services.insertData())
    try {
        const response = await services.insertData();
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res);
    }
}