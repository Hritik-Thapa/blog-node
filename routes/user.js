const express = require("expres");
const { model } = require("mongoose");
const User=require('../models/user')

const router = express.Router();

router.get("/signIn", (req, res) => {
  return res.render("signIn");
});

router.get("signUp", (req, res) => {
  return res.render("signUp");
});

router.post('/signup',(req,res)=>{
    const {fullName,email,pasword}=req.body;
})

modeul.exports = router;
