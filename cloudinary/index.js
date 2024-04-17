// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
// const multer  = require('multer')

// cloudinary.config({ 
//   cloud_name: 'dp34wlfqo', 
//   api_key: '155612375382567', 
//   api_secret: 'zfKPZctuNg0nmulgkV60AxjN2sg' 
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//        // if (!localFilePath) return null;
//         //upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         });
//         // file has been uploaded successfully
//         //console.log("file is uploaded on cloudinary ", response.url);
//         fs.unlinkSync(localFilePath);
//         return response;
//     } catch (error) {
//         fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
//         return null;
//     }
// }


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./uploads")
//     },
//     filename: function (req, file, cb) {  
//         callback(null,`image-${Date.now()}.${file.originalname}`)
//     }
//   });

//   const isImage = (req,file,callback)=>{
//     if(file.mimetype.startsWith("image")){
//         callback(null,true)
//     }else{
//         callback(new Error("only images is allow"))
//     }
// }
  
// module.exports = {storage};
// module.exports = { uploadOnCloudinary };
// module.exports ={isImage};


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YELLCAMP',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}