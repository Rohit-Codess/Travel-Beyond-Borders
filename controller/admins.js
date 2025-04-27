const User = require("../models/user");
const Listing = require("../models/listing");
const Review = require("../models/review");

// 1. Show all users
module.exports.usersByAdminPage = async (req, res) => {
  const users = await User.find({});
  res.render("admin/users.ejs", { users });
};

// 2. Delete user by admin
module.exports.deleteUsersByAdmin = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    req.flash("error", "User not found!");
    return res.redirect("/admin/users");
  }

  if (user.isAdmin) {
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    if (totalAdmins <= 1) {
      req.flash(
        "error",
        "Cannot delete. At least one Admin must always remain!"
      );
      return res.redirect("/admin/users");
    }
  }

  const listings = await Listing.find({ createdBy: id });

  for (let listing of listings) {
    await Listing.findByIdAndDelete(listing._id);
  }

  const reviews = await Review.find({ author: id });
  const reviewIds = reviews.map((r) => r._id);

  await Review.deleteMany({ author: id });

  await Listing.updateMany(
    { reviews: { $in: reviewIds } },
    { $pull: { reviews: { $in: reviewIds } } }
  );

  await User.findByIdAndDelete(id);

  req.flash(
    "success",
    `User "${user.username}" and all their listings & reviews have been deleted.`
  );
  res.redirect("/admin/users");
};

// 3. Admin Dashboard Route
module.exports.adminDasboard = async (req, res) => {
  const userCount = await User.countDocuments();
  const listingCount = await Listing.countDocuments();
  const reviewCount = await Review.countDocuments();

  res.render("admin/dashboard.ejs", { userCount, listingCount, reviewCount });
};

// 4. Promote a user to Admin
module.exports.promoteUserToAdmin = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/admin/users");
  }

  user.isAdmin = true;
  await user.save();

  req.flash("success", `${user.username} is now an Admin! 🚀`);
  res.redirect("/admin/users");
};

// 5. Demote Admin to Normal User
module.exports.demoteAdminToUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/admin/users");
  }

  if (!user.isAdmin) {
    req.flash("error", "User is already a normal user.");
    return res.redirect("/admin/users");
  }

  // Check how many admins are there
  const totalAdmins = await User.countDocuments({ isAdmin: true });

  if (totalAdmins <= 1) {
    req.flash("error", "Cannot demote. At least one Admin must always remain!");
    return res.redirect("/admin/users");
  }

  user.isAdmin = false;
  await user.save();

  req.flash("success", `${user.username} has been demoted to a Normal User.`);
  res.redirect("/admin/users");
};
