const express = require("express");
const Blog = require("../models/blog");
const multer=require("multer");
const path=require('path')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(`./public/uploads/`))
    },
    filename:function (req,file,cb){
        const fileName=`${Date.now()}-${file.originalname}`
        cb(null,fileName)
    }
});

const upload=multer({storage:storage});

const router=express.Router();

router.get('/add',(req,res)=>{
    return res.render('addBlog',{user:req.user})
});

router.post('/add',upload.single('coverImage'), async(req,res)=>{
    console.log(req.body);
    const {title,body}=req.body;
    const blog= await Blog.create({
        title,
        body,
        createdBy:req.user._id,
        coverImageUrl:`/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
});


router.get('/blog/:_id',(req,res)=>{
    const _id=req.params._id;
    const blog=Blog.find({_id})
    console.log(blog);
})
module.exports=router;