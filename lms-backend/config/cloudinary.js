require("dotenv").config()
const cloudinary=require("cloudinary").v2


cloudinary.config({
    cloud_name:process.env.cloudname,
    api_secret:process.env.api_secret,
    api_key:process.env.api_key
})

module.exports=cloudinary;