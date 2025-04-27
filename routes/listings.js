const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const { isLogedIn, isCreatedBy, validateListing } = require("../middleware.js");
const {
  allListings,
  newListing,
  showListing,
  newListingForm,
  editListingForm,
  updatedListing,
  deleteListing,
} = require("../controller/listings.js");

router
  .route("/")
  .get(wrapAsync(allListings))
  .post(isLogedIn, upload.single("listing[image]"),validateListing, wrapAsync(newListing));

router.get("/new", isLogedIn, wrapAsync(newListingForm));

router
  .route("/:id")
  .get(isLogedIn, wrapAsync(showListing))
  .put(isLogedIn, isCreatedBy,upload.single("listing[image]"),validateListing, wrapAsync(updatedListing))
  .delete(isLogedIn, isCreatedBy, wrapAsync(deleteListing));

router.get("/:id/edit", isLogedIn, isCreatedBy, wrapAsync(editListingForm));

module.exports = router;
