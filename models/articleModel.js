import { Schema,model,Types } from "mongoose";

const commentSchema = new Schema ({
    user:{
        type:Types.ObjectId,
        ref :"user",
        required:[true,"user id is required"],
    },
    comment:{
        type:String,
    }        
})
const articleSchema = new Schema({

    author :{
        type:Types.ObjectId,
        ref:"user",
        required:[true,"Author id is required"]
    },
    title:{
        type:String,
        required:[true,"title is required"],
    },
    category:{
        type:String,
        required:[true,"category  is required"],
    },
    content:{
        type:String,
        required :[true , "content is required"],
    },
    comments:[commentSchema],
    isArcticleActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
 

})

export const articleModel = model("article",articleSchema)