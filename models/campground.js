const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const User = require('./user');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

// virtual function because we are not storing this in the database
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [  // "one to many" relationship
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// 'findOneAndDelete' comes from the mongoose docs. because we're using findByIdAndDelete() in the app.js for deleting campgrounds,
// mongoose docs say that it will run findOneAndDelete middleware after that.
// also note that its a query middleware - works differently (passes in doc instead of allowing us to use 'this' keyword)
CampgroundSchema.post('findOneAndDelete', async function (doc) {

    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//export the schema
module.exports = mongoose.model('Campground', CampgroundSchema);