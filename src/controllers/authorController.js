const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")


const createAuthor = async function (req, res) {
    try {
        const{fName,lName,title,email,password} = req.body

        let savedAuthor = await authorModel.create({fName,lName,title,email,password})
        res.status(201).send({ msg: savedAuthor })
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }

}


const authorLogIn = async function (req, res) {
    try {
        const{ email, password } = req.body
        
        let valid = await authorModel.findOne({ email, password })
        if (!valid) {
            return res.status(404).send({ status: false, message: "emailId and password is incorrect" })
        }
        let token = jwt.sign({ authorId: valid._id }, "Ritesh-Rajput")
        return res.status(200).send({ status: true, message: token })

    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}


module.exports = { createAuthor, authorLogIn }

