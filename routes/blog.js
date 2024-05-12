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

router.get("/add", async (req, res) => {
  console.log("id undefined");
  return res.render("addBlog", { user: req.user,isEditing:false });
});

router
  .route("/edit")
  .get(async (req, res) => {
    const _id = req.query.id;
    console.log(`edit route ${_id}`);
    if (!_id) {
      // If no blog ID is provided, return an error or redirect to another page
      return res.status(400).send("Blog ID is missing");
    }
    try {
      // Find the blog by ID
      const blog = await Blog.findById(_id);
      if (!blog) {
        // If blog with the provided ID doesn't exist, return an error or redirect
        return res.status(404).send("Blog not found");
      }
      // Render the addBlog template with the found blog data
      return res.render("addBlog", { user: req.user, blog, isEditing:true });
    } catch (error) {
      // Handle any errors
      console.error("Error fetching blog:", error);
      return res.status(500).send("Internal Server Error");
    }
  })
  .put(upload.single("coverImage"), async (req, res) => {
    const id = req.query.id;
    const { title, body } = req.body;
    let coverImagePath = null;

    // Check if a file was uploaded
    console.log(req.file.path)
    if (req.file) {
      
      coverImagePath = `/uploads/blogCover/${req.file.filename}`;
      console.log(coverImagePath)
    }

    await Blog.findByIdAndUpdate(
      id,
      {
        title: title,
        body: body,
        ...(coverImagePath && { coverImageUrl: coverImagePath }),
      },
      { new: true }
    ).then((updatedBlog) => {
      console.log(updatedBlog);
    });

    return res.sendStatus(200);
  });

router.post("/add", upload.single("coverImage"), async (req, res) => {
  console.log(req.body);
  const { title, body } = req.body;
  coverImageUrl = `/uploads/blogCover/${req.file.filename}`;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/blogCover/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router
  .route("/:_id")
  .get(async (req, res) => {
    const _id = req.params._id;
    const comments = await Comment.find({ blogId: _id }).populate("createdBy");
    const blog = await Blog.findById({ _id }).populate("createdBy");
    //   console.log(comments);
    return res.render("blog", { blog, user: req.user, comments });
  })
  .delete(async (req, res) => {
    const _id = req.params._id;
    try {
      await Blog.deleteOne({ _id });
    } catch (error) {
      console.log("Error in deleting the blog");
      return res.status(400);
    }
    return res.sendStatus(200);
  })
  .patch((req, res) => {});

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
    const comment = await Comment.findOneAndUpdate(
      { _id },
      { $set: { content: newText } }
    );
    return res.sendStatus(200);
  });
module.exports = router;
