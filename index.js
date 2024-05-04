const path=require('path')

const express=require('express');
const mongoose=require('mongoose');
const ejs=require('ejs');

mongoose.connect('mongodb://localhost:27017/blogs').then((e)=>console.log('MongoDB connected'));

const userRoute=require('./routes/user')

const app=express();
const PORT=5000;

app.set('view engine','ejs')
app.set('views',path.resolve('./views'));
app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.render('home')
})

app.use('/user',userRoute);
app.listen(PORT,()=>console.log(`Server started at ${PORT}`));