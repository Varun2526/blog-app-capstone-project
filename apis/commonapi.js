import exp from "express";
import { compare, hash } from "bcrypt";
import {userModel} from "../models/usermodel.js"
import jwt from "jsonwebtoken"

const {sign}= jwt
export const commonapp = exp.Router();
//routes for register
commonapp.post("/users",async(req,res)=>{
    let allowedroles = ["USER","AUTHOR"]
    //get user from req
    const newuser= req.body
    //check role 
    if(!allowedroles.includes(newuser.role))
        return res.status(400).json({message:"Invalid role"})
    //hash the password nd replace the plain with hashed one 
    newuser.password = await hash (newuser.password,12)
    //create new user document 
    const newuserdoc = new userModel(newuser)
    //save doc
    await newuserdoc.save()
    //send dres
    res.status(201).json({message:"registered"})
})

//route for login
commonapp.post("/login",async(req,res)=>{
   //get user cred obj 
   const {email,password} = req.body
   //find the user by email 
   const user = await userModel.findOne({email:email})
   //if user not found 
   if(!user){
    return res.status(400).json({message:"invaild email"})
   }
   //compare the password if email is found. 
   const isMatched = await compare(password,user.password)
   //if password is not matched 
   if(!isMatched){
    return res.status.json({message:"invaild password"})
   }
   //both are vaild now create a jwt token 
   const signedtoken = sign({id:user_id,email:email, role:user.role},process.env.SECRET_KEY)

   //set the cookien as cookie 

   res.cookie("token",signedtoken,{

    httpOnly:true,
    secure:false,
    sameSite:"lax"
   })
   //remove the password 
   let userObj = user.toObject()
   delete userObj.password
   res.status(200).json({message:"login succesful ",payload:userObj})
})

//route for logut
commonapp.get("/logout",(req,res)=>{
    res.clearCookie("token",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
    })
    res.status(200).json({message:"logout succesful"})
})