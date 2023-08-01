import db from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { notAuth } from '../middlewares/handle_erros';
require('dotenv').config();

const hashPassword = password => bcrypt.hashSync(password,bcrypt.genSaltSync(8));//số càng cao thì càng lâu 

export const register =({email,password}) => new Promise(async(resolve,reject)=>{
    console.log({email,password})
    try {
        const response = await db.User.findOrCreate({
            where:{ email },
            defaults:{//thêm 's' vào cuối sẽ tạo được nhiều cột 
                email,
                password : hashPassword(password)
            }
        });
        // console.log(response);
        const accessToken = response[1]? jwt.sign({
            id:response[0].id,
            email:response[0].email,
            role_code:response[0].role_code   
        },process.env.JWT_SECRET,{expiresIn:'5s'}) :null//expiresIn là lưu trữ trong bao lâu (ngày )
        // refresh token 
        const refreshToken = response[1]? jwt.sign({
            id:response[0].id,
        },process.env.JWT_SECRET_REFRESH_TOKEN,{expiresIn:'15d'}) :null//expiresIn là lưu trữ trong bao lâu (ngày )
       
        resolve({
            err:response[1] ? 0 : 1,
            message:response[1] ? 'Resgister is successfully' : 'Email is used',
            'access_token': accessToken ? `Bearer ${accessToken}` : accessToken ,
            'refresh_token': refreshToken 
        })
        if(refreshToken){
            await db.User.update({
                refresh_token:refreshToken
            },{
                where:{id:response[0].id}
            })
        }
    } catch (error) {
        reject(error);
    }
})
export const login =({email,password}) => new Promise(async(resolve,reject)=>{
    try {
        const response = await db.User.findOne({
            where:{ email },
            raw:true
        });
        const isChecked = response && bcrypt.compareSync(password,response.password)
        const token = isChecked ?jwt.sign({
            id:response.id,
            email:response.email,
            role_code:response.role_code  
        },process.env.JWT_SECRET,{expiresIn:'5s'}):null;
        // refresh token 
        const refreshToken = isChecked? jwt.sign({
            id:response.id,
        },process.env.JWT_SECRET_REFRESH_TOKEN,{expiresIn:'60s'}) :null//expiresIn là lưu trữ trong bao lâu (ngày )


        resolve({
            err:token ? 0 : 1,
            message:token ? 'Login is successfully' : response ? 'password is wrongs':'email has been registed',
            'access_token': token ? `Bearer ${token}` : token ,
            'refresh_token': refreshToken 

        })
        if(refreshToken){
            await db.User.update({
                refresh_token:refreshToken
            },{
                where:{id:response.id}
            })
        }
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

export const refreshToken =(refresh_token) => new Promise(async(resolve,reject)=>{
    try {
        const response =await db.User.findOne({
            where:{refresh_token}
        })
        if(response){
            jwt.verify(refresh_token,process.env.JWT_SECRET_REFRESH_TOKEN,(err)=>{
                if(err){
                    resolve({
                        err:1,
                        mes:'Refresh token expired. Require login'
                    })
                }else{
                    const accessToken = jwt.sign({
                        id:response.id,
                        email:response.email,
                        role_code:response.role_code   
                    },process.env.JWT_SECRET,{expiresIn:'2d'})
                    resolve({
                        err:accessToken?0:1,
                        mes:accessToken? 'oke' : 'fail to genertate new ccess token ,let try more time ',
                        'access_token':accessToken,
                        'refresh_token':refresh_token
                    })
                }
            })
        }
    } catch (error) {
        console.log(error);
        reject(error);
    }
})