const express = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/blogCover/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/add", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

router.post("/add", upload.single("coverImage"), async (req, res) => {
  console.log(req.body);
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/blogCover/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.get("/:_id", async (req, res) => {
  const _id = req.params._id;
  const comments = await Comment.find({ blogId: _id }).populate("createdBy");
  const blog = await Blog.findById({ _id }).populate("createdBy");
  //   console.log(comments);

  return res.render("blog", { blog, user: req.user, comments });
});

router.post("/comment/:blogId", async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router
  .route("/comment/:commentId")
  .delete(async (req, res) => {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    console.log(`delete ${comment}`);
    const blogId = comment.blogId;
    await Comment.deleteOne({ _id: commentId });
    return res.sendStatus(202);
  })
  .patch(async (req, res) => {
    const _id = req.params.commentId;
    const newText = req.body.text;
    const comment=await Comment.findOneAndUpdate({ _id }, { $set: { content: newText } });
    return res.sendStatus(200);
  });
module.exports = router;
