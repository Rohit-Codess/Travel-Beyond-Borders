const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utilities/wrapAsync.js");
const {
  validateReview,
  isLogedIn,
  isReviewAuthor,
} = require("../middleware.js");

const {
  allReviews,
  createReviews,
  deleteReviews,
} = require("../controller/reviews.js");

router.route("/")
.get(isLogedIn, wrapAsync(allReviews))
.post(isLogedIn, validateReview, wrapAsync(createReviews));

//12. Delete a specific review
router.delete(
  "/:reviewId",
  isLogedIn,
  isReviewAuthor,
  wrapAsync(deleteReviews)
);

module.exports = router;
