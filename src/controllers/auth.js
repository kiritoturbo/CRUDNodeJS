import * as services from "../services"
import { internalServerError,badRequest } from "../middlewares/handle_erros";
import {email,password,refreshToken} from "../helpers/joi_schema";
import joi from 'joi'

export const registerUser=async(req,res)=>{
    try {
        const {error} = joi.object({email,password}).validate(req.body)
        if(error) return badRequest(error.details[0]?.message,res);
        // const {email,password} = req.body;
        // if(!email || !password) return res.status(400).json({
        //     err: 1,
        //     message: 'missing payloads'
        // })
        const response = await services.register(req.body);
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res);
    }
}
export const loginUser=async(req,res)=>{
    try {
        const{error} = joi.object({email,password}).validate(req.body)
        if(error) return badRequest(error.details[0]?.message,res);
        const response = await services.login(req.body);
        console.log(response)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res);
    }
}
export const refreshTokenController =async(req,res)=>{
    try {
        const {error} = joi.object({refreshToken}).validate(req.body)
        if(error) return badRequest(error.details[0]?.message,res)
        const response = await services.refreshToken(req.body.refreshToken);
        console.log(response)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res);
    }
}