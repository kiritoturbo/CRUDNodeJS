import db from '../models';

//get user
export const getOne =(userId) => new Promise(async(resolve,reject)=>{
    try {
        const response = await db.User.findOne({
            where:{ id: userId },
            attributes: {
                exclude:['password','role_code','refresh_token']
            },
            include:[
                {model:db.Role,as:'roleData',attributes:['id','code','value']}
            ]
        });
        // console.log(response);
        resolve({
            err:response ? 0 : 1,
            message:response ? 'Got' : 'User not found',
            userData: response
        })
    } catch (error) {
        // console.log(error);
        reject(error);
    }
})
