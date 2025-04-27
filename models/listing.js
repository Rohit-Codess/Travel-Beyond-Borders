const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url : String,
    filename : String,
  },
  price: {
    type: Number,
    min: 1,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref : "Review"
    },
  ],
  createdBy : {
    type: Schema.Types.ObjectId,
    ref : "User"
  },
  category: {
    type: String,
    enum: ["park", "waterfall", "forest", "resort", "mall", "temple", "lake", "zoo", "museum", "beach", "hill station", "fort", "desert", "cave", "island", "river"],
    required: true,
  },
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

let Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
