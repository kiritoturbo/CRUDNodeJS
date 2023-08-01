import db from '../models';
import { Op } from 'sequelize';
import {v4 as generateId} from 'uuid'
const cloudinary = require('cloudinary').v2;

//get user:READ 
export const getBooks =({page,limit, order, name, available, ...query}) => new Promise(async(resolve,reject)=>{
    try {
        const queries = {raw: true , nest : true }
        const offset =(!page || +page <=1 )? 0 :(+page - 1)
        const fLimit = +limit || +process.env.LIMIT_BOOK
        queries.offset = offset * fLimit
        queries.limit=fLimit
        if(order) queries.order=[order]
        if(name) query.title = {[Op.substring]: name}
        if(available) query.available = {[Op.between]: available}
        const response = await db.Book.findAndCountAll({
            where: query,
            ...queries,
            attributes:{
                exclude:['category_code','description']
            },
            include:[
                {model:db.Category,attributes:{exclude:['createdAt','updateAt']},as:'categoryData'}
            ]
        })
        resolve({
            err:response ? 0 : 1,
            message:response ? 'Got' : 'Cannot found',
            bookData: response
        })
    } catch (error) {
        reject(error);
    }
})
//create
export const createNewBook =(body , fileData) => new Promise(async(resolve,reject)=>{
    try {
        const response = await db.Book.findOrCreate({
            where: {title: body?.title},
            defaults:{
                ...body,
                id:generateId(),
                image: fileData?.path,
                filename:fileData?.filename
            }
        })
        resolve({
            err:response[1] ? 0 : 1,
            message:response[1] ? 'created' : 'not create new book',
        })
        if(fileData && !response[1]) cloudinary.uploader.destroy(fileData.filename)
    } catch (error) {
        reject(error);
        if(fileData) cloudinary.uploader.destroy(fileData.filename)
    }
})
//update 
export const updateBook =({bid,...body} , fileData) => new Promise(async(resolve,reject)=>{
    try {
        if(fileData) body.image=fileData?.path
        const response = await db.Book.update(body,{
            where:{id : bid}
        })
        resolve({
            err:response[0]>0 ? 0 : 1,
            message:response[0]>0 ? `${response[0]} book updated` : 'cannot update',
        })
        if(fileData && response[0] === 0) cloudinary.uploader.destroy(fileData.filename)
    } catch (error) {
        reject(error);
        if(fileData) cloudinary.uploader.destroy(fileData.filename)
    }
})
//delete
export const deleteBook =(bids,filename) => new Promise(async(resolve,reject)=>{
    try {
        const response = await db.Book.destroy({
            where:{id : bids}
        })
        resolve({
            err:response > 0 ? 0 : 1,
            message: `${response } book deleted`,
        }) 
       cloudinary.api.delete_resources(filename)

    } catch (error) {
        reject(error);
    }
})