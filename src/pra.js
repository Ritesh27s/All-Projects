const deleteBlog = async function(req,res){
try{
    
    let blogId = req.params.blogId
    let check = await blogModels.findById(blogId)
    if(!check){
        return res.status(404).send({status : false ,msg : "this Id does not exits" })     
    }
    if(check.isDeleted == true){
        return res.status(400).send({status :false,msg : "already deleted" })
    }
    let deleteBlogs = await blogModels.findOneAndUpdate(check,{$set : {isDeleted : true,deletedAt : moment().format("YYYY MM DD")}})
    return res.status(200).send({msg :"deleted successfully"})

}
catch(err){
    res.status(500).send({msg : err.message})
}
}




const login = async function(req,res){
 try{   let emailId = req.body.emailId
    let password = req.body.password
    let loginAuth = await authorModel.find({emailId,password})
    if(!loginAuth){
        return res.status(400).send({status : false ,msg :"pleas enter valid email and password" })
    }
    let token = jwt.sign({authorId : loginAuth.authorId},"RITESH-RAJPUT")
    return res.status(200).send({status : true,msg : token})
}
catch(err){
    res.status(500).send({status : false , msg : err.message})
}
}