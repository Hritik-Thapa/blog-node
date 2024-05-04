const path=require('path')

const express=require('express');
const mongoose=require('mongoose');
const ejs=require('ejs');

const app=express();
const PORT=5000;

app.set('view engine','ejs')
app.set('views',path.resolve('./views'));

app.get('/',(req,res)=>{
    res.render('home')
})
app.listen(PORT,()=>console.log(`Server started at ${PORT}`));