const express = require("express")
const router = express.Router()


const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const { authentication, authorization } = require("../middleware/commonMiddleware")


router.post("/authors", authorController.createAuthor)

router.post("/blogs", authentication, blogController.createBlog)

router.get("/blogs", authentication, blogController.getByBlogs)

router.put("/blogs/:blogId", authentication, authorization, blogController.updateBlogs)

router.delete("/blogs/:blogId", authentication, authorization, blogController.deleteBlogs)

router.delete("/blogs", authentication, authorization, blogController.deleteBlog)

router.post("/login", authorController.authorLogIn)



module.exports = router










































