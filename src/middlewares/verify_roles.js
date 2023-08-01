import { notAuth } from "./handle_erros";

export const isAdmin =(req,res,next)=>{
    const {role_code} = req.user;
    if(role_code != 'R1') return notAuth('require role Admin ',res)
    next();
}
export const isCreatorOrAdmin =(req,res,next)=>{
    const {role_code} = req.user;
    if(role_code != 'R1' && role_code != 'R2') return notAuth('require role Admin or Creator ',res)
    next();
}
