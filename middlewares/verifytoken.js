import jwt from "jsonwebtoken"
import {config} from "dotenv"

config()
const {verify}=jwt


export const verifytoken =(...allowedroles)=>{
    //verify token ("AUTHOR",USER,ADMIN)")
     return(req,res,next)=>{
    try{
    //get the token from header
    const token = req.cookies?.token
    //if token is not present 
    if(!token){
        return res.status(401).json({message:"please login first"})
    }
    //valudate token
    let decodedtoken = verify(token,process.env.SECRET_KEY)
    //check the role is same as in decoded token
  if (!allowedroles.includes(decodedtoken.role)){
    return res.status(403).json({message:"you are not authorized to access this resource"})
  }
    //add decoded token 
    req.user = decodedtoken
    next()
    }
    catch(err){
        return res.status(401).json({message:"invalid token"})
    }
}
}