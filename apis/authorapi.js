import exp from 'express';
import { articleModel } from '../models/articlemodel.js';
import { userModel } from '../models/usermodel.js';
import { verifytoken } from '../middlewares/verifytoken.js';

 export const authorapp = exp.Router();


//write article
 authorapp.post("/article",verifytoken("AUTHOR"),async(req,res)=>{
    //get article obj from client 
    const articleObj = req.body 
    //check only if author is passed 
    let author = await userModel.findById(articleObj.author)
    //if author id is not passed or author is not found in db
    if(!author){
        return res.status(404).json({message:"author id is required"})
    }
    //check role
    if(author.role !== "AUTHOR"){
        return res.status(403).json({message:"only author can write article"})
    }
    //verify authenticated user matches the author - AUTHORIZATION CHECK
    if(req.user.email !== author.email){
        return res.status(403).json({message:"you can only create articles for yourself"})
    }
   //create article document 
   let article = new articleModel(articleObj)
   //save article to db 
   article = await article.save()
   //return response to client 
   return res.status(201).json({message:"Article created successfully",article})
    
 })

 // read articles of the author
authorapp.get("/articles",verifytoken("AUTHOR"),async(req,res)=>{
   //read articles from author id
   const authorIdoftoken= req.user?.id
   const articlesList = await articleModel.find({author:authorIdoftoken})
   res.status(200).json({message:"articles fetched successfully",articlesList})
})

// //update article
// authorapp.put("/article",verifytoken("AUTHOR"),async(req,res)=>{
//     //get the article id from body
//     const {articleid} = req.body
//     //find the article by id 
//     let article = await articleModel.findById(articleid)
//     //if article not found 
//     if(!article){
//         return res.status(404).json({message:"article not found"})
//     }
//     //verify author matches - authorization check
//     const author = await userModel.findById(article.author)
//     if(req.user.email !== author.email){
//         return res.status(403).json({message:"you can only update your own articles"})
//     }
//     //update the article
//     const updatedArticle = await articleModel.findByIdAndUpdate(articleid,req.body,{new:true})
//     //return response to client
//     res.status(200).json({message:"article updated successfully",updatedArticle})
// })

authorapp.put ("/article",verifytoken("AUTHOR"),async(req,res)=>{
//get author id from decoded token 
const authorIdofToken = req.user?.id
//get modified article from client
const {articleid,title,category,content} = req.body
const modifiedarticle = await articleModel.findOneAndUpdate(
    {_id:articleid,author:authorIdofToken},
    {$set:{title,category,content}},
    {new:true})
//if either article id or author not correct 
if(!modifiedarticle){
    return res.status(403).json({message:" not  authorized to edit this article"})
}
//send response to client
res.status(200).json({message:"article updated successfully",modifiedarticle})
})