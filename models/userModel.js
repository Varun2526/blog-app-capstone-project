import {Schema,model} from "mongoose"

const userSchema = new Schema({
    firstName:{
        type:String,
        required:[true,"first name is required"]
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:[true,"Email required"],
        unique:[true,"Email already existed"]
    },
    password:{
        type:String,
        required:[true,"password required"],
    },
    role:{
        type:String,
        enum:["USER","AUTHOR","ADMIN"],
        required:[true,"{Value} is an invalid role"]
    },
    profileimageurl:{
        type:String
    },
    isuseractive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

export const userModel = model("user",userSchema)