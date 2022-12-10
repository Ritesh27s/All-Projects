const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const route = require("./route/route.js")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb+srv://ritesh:zbZGz8vHtAKmPfio@newcluster.88v7uq9.mongodb.net/?retryWrites=true&w=majority", {
   useNewUrlParser: true
})
   .then(() => console.log("mongoDb is connected"))
   .catch((err) => console.log(err))

app.use("/", route)

app.listen(process.env.PORT || 3000, function () {
   console.log("server is running on port" + " " + (process.env.PORT || 3000))
})