const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");
const review = require ("../backend/models/review.model")

/** obtiene una pelicula por id **/

async function getById(id) {
  const collection = getMovieCollection();
  return await collection.findOne({ _id: new ObjectId(id) });
}
 

const reviewSchema = new mongoose.Schema(
    {
        movie : { type: mongoose .Schema.types.ObjectId, ref: " movie" , required: true  },
        user: { type: mongoose .Schema.types.ObjectId, ref: "user", required: true},
        rating: { 
            type: number ,
            required : true,
            min: 1,
            max: 5, 
        },
        comment: { type: String, trim: true },
    },
    { timeStamp : true }
);

module.exports = mongooose.model(" review ", reviewSchema);

exports.getReviews = async (req, res) => {
    try {
        const review = await review.find().populate("user").populate("movie");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "error de reseña ", error })
    }
}

