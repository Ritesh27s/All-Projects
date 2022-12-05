const mongoose = require("mongoose")
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const { isValid, isValidDate } = require("../validator/validation")
const reviewModel = require("../models/reviewModel")


// <<<<<<<<<<<<<-------------Create Book-------------->>>>>>>>>>>>>>>>

const createBook = async function (req, res) {
   try {
      let data = req.body
      let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
      if (!Object.keys(data).length) return res.status(400).send({ status: false, message: "Please enter the required data" })

      if (!isValid(title)) return res.status(400).send({ status: false, message: "title is required" })

      title = title.trim()
      let unique = await bookModel.findOne({ title: title })
      if (unique) return res.status(400).send({ status: false, message: "Book title are already exists" })

      if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "excerpt is required" })

      let validId = await userModel.findOne({ _id: userId })
      if (!validId) return res.status(404).send({ status: false, message: "No such user found for this userId" })

      if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN of book is required" })

      let Isbn = await bookModel.findOne({ ISBN: ISBN })
      if (Isbn) return res.status(400).send({ status: false, message: "ISBN No. already exist" })

      if (!isValid(category)) return res.status(400).send({ satus: false, message: "category is required" })

      if (!isValid(subcategory)) return res.status(400).send({ satus: false, message: "subcategory is required" })

      if (!releasedAt) return res.status(400).send({ status: false, message: "Please enter released date" })

      let create = await bookModel.create(data)
      return res.status(201).send({ status: true, message: "Book created succesfully", data: create })

   }
   catch (error) {

      return res.status(500).send({ status: false, message: error.message })
   }

}

// <<<<<<<<<<<<<-----------Get Book Lists-------------->>>>>>>>>>>>>>>>

const getBooks = async function (req, res) {
   try {
      let data = req.query
      if (data) {
         let { userId, category, subcategory } = data
         let obj = {}
         if (userId) obj.userId = userId

         if (category) obj.category = category

         if (subcategory) obj.subcategory = subcategory
         obj.isDeleted = false

         let books = await bookModel.find(obj).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

         if (books.length == 0) return res.status(404).send({ status: false, message: "No such books found" })
         return res.status(200).send({ status: true, message: "Books lists", data: books })
      }

      else {
         let collection = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
         if (collection.length == 0) return res.status(404).send({ status: false, message: "Book not found" })
         return res.status(200).send({ status: true, message: "Books lists", data: collection })
      }

   } catch (error) {
      return res.status(500).send({ status: false, message: error.message })

   }
}

// <<<<<<<<<<<<<-----------Get Book Lists By Book id-------------->>>>>>>>>>>>>>>>

const getBookById = async function (req, res) {
   try {
      let Id = req.params.bookId
      if (!mongoose.isValidObjectId(Id)) return res.status(400).send({ status: false, message: "Please enter valid BookId" })

      let collection = await bookModel.findById(Id).select({ __v: 0 })
      if (!collection) return res.status(404).send({ status: false, message: "Book not found" })

      if (collection.isDeleted) return res.status(400).send({ status: false, message: "Book no longer exist" })

      let reviewsData = await reviewModel.find({ bookId: Id }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
      collection._doc.reviewsData = reviewsData
      return res.status(200).send({ status: true, message: "Book lists", data: collection })

   } catch (error) {
      return res.status(500).send({ status: false, message: error.message })

   }
}

// <<<<<<<<<<<<<----------- Update a book -------------->>>>>>>>>>>>>>>>

const updateBook = async function (req, res) {
   try {
      let bookId = req.params.bookId
      let data = req.body
      let { title, excerpt, releasedAt, ISBN } = data

      if(title){
      if (!isValid(title)) return res.status(400).send({ status: false, message: "Please enter a title" })

      let titleCheck = await bookModel.findOne({ title })

      if (titleCheck) return res.status(400).send({ status: false, message: "title is already exists" })
      }

      if(releasedAt){
      if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: "Please enter released date" })

      if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "Please enter date in (YYYY/MM/DD) this format" })
      }
      
      if(ISBN){
      let isbnCheck = await bookModel.findOne({ ISBN: ISBN })

      if (isbnCheck) return res.status(400).send({ status: false, message: "ISBN is already exists" })

      }
      
      let idCheck = await bookModel.findById(bookId)
      if (!idCheck) return res.status(404).send({ status: false, message: "book not found " })

      if (idCheck.isDeleted) return res.status(400).send({ status: false, message: "this book is no longer exist" })

      let update = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN } }, { new: true })

      return res.status(200).send({ status: true, message: "successfully updated", data: update })

   } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
   }
}

// <<<<<<<<<<<<<----------- Delete a book -------------->>>>>>>>>>>>>>>>

const deleteBook = async function (req, res) {
   try {
      let Id = req.params.bookId

      let collection = await bookModel.findById(Id)
      if (!collection) return res.status(404).send({ status: false, message: "Book not found" })

      if (collection.isDeleted) return res.status(400).send({ status: false, message: "Book no longer exist" })

      let deleteData = await bookModel.findOneAndUpdate({ _id: Id }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

      return res.status(200).send({ status: true, message: "succesfully deleted", data: deleteData })

   } catch (error) {
      return res.status(500).send({ status: false, message: error.message })

   }
}

// <<<<<<<<<<<<<----------- Export all the functions -------------->>>>>>>>>>>>>>>>

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook }
