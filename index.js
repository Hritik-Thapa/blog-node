const path=require('path')

const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const ejs=require('ejs');

mongoose.connect('mongodb://localhost:27017/blogs').then((e)=>console.log('MongoDB connected'));

const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');

const Blog=require('./models/blog')
const { authenticateCookie } = require('./middlewares/authentication');

const app=express();
const PORT=5000;

app.set('view engine','ejs')
app.set('views',path.resolve('./views'));

app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(authenticateCookie('token'));
app.use(express.static(path.resolve('./public')))

app.get('/',async (req,res)=>{
    const blogList=await Blog.find({})
    res.render('home',{user:req.user,blogs:blogList});
})

app.use('/blog',blogRoute);
app.use('/user',userRoute);
app.listen(PORT,()=>console.log(`Server started at ${PORT}`));