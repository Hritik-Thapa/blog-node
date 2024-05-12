const { Router } = require("express");
const User = require("../models/user");
const Blog = require("../models/blog");
const multer = require("multer");
const path = require("path");

const storage=multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,path.resolve(`./public/uploads/pfp`))
    },
    filename: function (req, file, cb){
        const fileName=`${req.user._id}`;
        cb(null,fileName);
    }
});

const upload = multer({ storage: storage });

const router = Router();

router.get("/", async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select('-password -salt');
  const blogList = await Blog.find({ createdBy: userId });
  return res.render("dashboard", {
    user,
    blogs: blogList,
  });
});

router.patch('/changePfp',upload.single('pfpImage'), async (req,res)=>{
    console.log('pfp change')
    const _id=req.query.id;
    const pfpUrl=`/uploads/pfp/${_id}`
    try{
        await User.findOneAndUpdate({_id},{$set:{pfpUrl}});
    }catch(err){
        console.log(err);
    }
    return res.sendStatus(200);
})

module.exports = router;
