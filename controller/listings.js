const Listing = require("../models/listing");

// 1.Index Route display all the contents
module.exports.allListings = async (req, res) => {
  const { category } = req.query;

  let matchStage = {};
  if (category) {
    matchStage.category = category; // 🔥 Filter by category if exists
  }

  const listings = await Listing.aggregate([
    { $match: matchStage }, // 🔥 Filter by category if exists
    {
      $group: {
        _id: "$createdBy", // Group by user
        listingId: { $first: "$_id" }, // Only one listing per user
      },
    },
  ]);

  const listingIds = listings.map((l) => l.listingId);

  const allData = await Listing.find({ _id: { $in: listingIds } }).populate(
    "createdBy"
  );

  if (category && allData.length === 0) {
    req.flash("error", `No listings found for category: "${category}"`);
    return res.redirect("/listings")
  }

  res.render("./listings/index.ejs", { allData , pageCSS : "index.css" });
};

// 3.new GET Route to display the form
module.exports.newListingForm = async (req, res) => {
  return res.render("./listings/new.ejs", { pageScript: "newListingForm.js" });
};

// 2.Show Route to display a specific content
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        // select: "username" // <--- this is important
      },
    })
    .populate({
      path: "createdBy",
      // select: "username"
    });

  if (!listing) {
    req.flash("error", "Listing you want is not available ⚠️");
    return res.redirect("/listings");
  }

  return res.render("./listings/show.ejs", { listing, pageCSS: "show.css" });
};

// 4.POST Route using form to create and add listing in Index Route
module.exports.newListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.createdBy = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  // req.flash("success", "Listing created!");
  return res.redirect(`/listings/${newListing._id}`);
};

// 5.Edit Route to edit the specific data based on there id
module.exports.editListingForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing do you want is not Available ⚠️");
    return res.redirect("/listings");
  }

  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_200");
  return res.render("./listings/edit.ejs", { listing, originalImage });
};

// 6.Update The specific data based on there id
module.exports.updatedListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  const updatedData = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedData.image = { url, filename };
    await updatedData.save();
  }

  req.flash("success", "Listing Edited");
  return res.redirect(`/listings/${id}`);
};

// 7.Delete Route for listings
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("error", "Listing is Deleted 😔");
  return res.redirect("/listings");
};
