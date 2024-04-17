const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// In Mongoose, which is an Object Data Modeling (ODM) library for MongoDB and Node.js, a schema is a blueprint that defines the structure of the documents (data records) within a MongoDB collection. It provides a way to enforce 
// the structure of documents, data types, and validation rules. Essentially, a Mongoose schema helps you define the shape of your data and ensures that documents stored in MongoDB adhere to that structure.


const CampgroundSchema = new Schema({
    title: String,
    Image: [
        {
            url:String,
            filename:String
        }
    ],
    price: Number,
    description : String,
    location: String,
    author: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);