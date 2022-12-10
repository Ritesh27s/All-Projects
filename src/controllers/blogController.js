const blogModels = require("../models/blogModels")
const authorModel = require("../models/authorModel")
const moment = require("moment")



const createBlog = async function (req, res) {
    try {
        let data = req.body

        let authorId = await authorModel.findById({ _id: data.authorId })
        if (!authorId) {
            return res.status(400).send({ msg: "author does not exist" })
        }
        let savedBlog = await blogModels.create(data)
        res.status(201).send({ msg: savedBlog })
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }

}



const getByBlogs = async function (req, res) {
    try {
        let query = req.query
        query.isDeleted = false
        query.ispublished = true
        let getBlogs = await blogModels.find(query)
        if (getBlogs.length == 0) {
            return res.status(404).send({ status: false, message: "this type of data does not exits" })
        }
        return res.status(200).send({ status: true, message: getBlogs })

    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}



const updateBlogs = async function (req, res) {
    try {
        const { title, body, tags, subcategory, isPublished } = req.body

        let blogId = req.params.blogId

        if (!blogId) {
            return res.status(400).send({ status: false, message: "please enter blog id in params" })
        }
        let validId = await blogModels.findById(blogId)
        if (!validId) {
            return res.status(404).send({ status: false, message: "this id does not exits" })
        }
        if (validId.isDeleted == true) {
            return res.status(404).send({ status: false, message: "this is not exixts" })
        }
        if (validId.isPublished == false) {
           await blogModels.findOneAndUpdate({ _id: blogId }, { $set: { isPublished : isPublished, publishedAt: moment().format('YYYY MM DD') } })
           
        }
           await blogModels.updateOne({ _id: blogId },
              { $set: { title: title, body: body }, 
              $push: { tags: tags, subcategory: subcategory }},
              { new: true }
        ) 
        let updatedData = await blogModels.findById(blogId)
        return res.status(200).send({ status: true, message: updatedData })

        

    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}



const deleteBlogs = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!blogId) {
            return res.status(400).send({ status: false, message: "please enter blogId" })
        }
        let validId = await blogModels.findById(blogId)
        if (!validId) {
            return res.status(404).send({ status: true, message: "this is not exixts" })
        }
        if (validId.isDeleted == true) {
            return res.status(400).send({ msg: "blog already deleted" })
        }
        else {
            await blogModels.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: moment().format('YYYY MM DD') } }, { new: true })
            return res.status(200).send()
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}




const deleteBlog = async function (req, res) {
    try {
        let query = req.query
        let data = await blogModels.findOne(query)
        if (!data) {
            return res.status(404).send({ status: false, msg: "Invalid data!" })
        }
        if (data.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "already deleted" })
        }
        else {
            await blogModels.updateOne({ _id: data._id }, { $set: { isDeleted: true, deletedAt: moment().format('YYYY MM DD') } })
            return res.status(200).send()
        }

    } 
    catch (err) {
        return res.status(500).send({ msg: err.message })

    }
}




module.exports = { createBlog, getByBlogs, updateBlogs, deleteBlogs, deleteBlog }
