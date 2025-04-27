const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Review = require("./review");
const Listing = require("./listing");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default: "/image/user.png"
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

// When a user is deleted, also remove their reviews from listings
userSchema.post("findOneAndDelete", async function (user) {
  if (user) {
    // Find and delete all reviews authored by this user
    const reviews = await Review.find({ author: user._id });

    // Collect review IDs
    const reviewIds = reviews.map((r) => r._id);

    // Delete those reviews
    await Review.deleteMany({ author: user._id });

    // Remove review references from listings
    await Listing.updateMany(
      { reviews: { $in: reviewIds } },
      { $pull: { reviews: { $in: reviewIds } } }
    );

    console.log(`Deleted user’s ${reviewIds.length} reviews from listings.`);
  }
});

module.exports = mongoose.model("User", userSchema);


