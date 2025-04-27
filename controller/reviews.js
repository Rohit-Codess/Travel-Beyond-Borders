const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.allReviews = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing do you want is not Available ⚠️");
    return res.redirect("/listings");
  }
  return res.render("./listings/review.ejs", { listing, pageScript: "newReviewForm.js"} );
};

module.exports.createReviews = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const { comment, rating } = req.body;

  const newReview = new Review({ comment, rating });
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review created");
  if (!listing) {
    req.flash("error", "Listing do you want is not Available ⚠️");
    return res.redirect("/listings");
  }
  return res.redirect(`/listings/${id}`);
};

module.exports.deleteReviews = async (req, res) => {
  const { id, reviewId } = req.params;
  // Remove review from the Listing's reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete review document from Review collection
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully 🗑️");
  return res.redirect(`/listings/${id}`);
};
