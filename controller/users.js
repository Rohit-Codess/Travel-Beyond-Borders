const User = require("../models/user");
const Review = require("../models/review");
const Listing = require("../models/listing");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// 1. GET Route to display the signup form
module.exports.signupForm = async (req, res) => {
  return res.render("./users/signup.ejs", { pageScript: "passwordTypeValidation.js" });
};

// 2. POST Route to create a new user and redirect to the listings page
module.exports.signupUser = async (req, res, next) => {
  try {
    let { username, email, password, confirmPassword } = req.body;

    // 1️⃣ First, Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash(
        "error",
        "Email is already registered! Please login or use another email."
      );
      return res.redirect("/users/signup");
    }

    // 2️⃣ Then continue with password validation
    if (password !== confirmPassword) {
      req.flash("error", "Password and Confirm Password do not match!");
      return res.redirect("/users/signup");
    }

    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordPattern.test(password)) {
      req.flash(
        "error",
        "Password must contain lowercase, uppercase, number, symbol and minimum 8 characters."
      );
      return res.redirect("/users/signup");
    }

    // 3️⃣ Create New User
    let newUser = new User({ username, email });
    let userRegister = await User.register(newUser, password);

    req.login(userRegister, (err) => {
      if (err) {
        return next(err);
      }
      req.flash(
        "success",
        `Welcome back ${req.user.username}❤️ in Beyond Borders! 🎉`
      );
      return res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/users/signup");
  }
};

// 3. GET Route to display the login form
module.exports.loginForm = async (req, res) => {
  return res.render("./users/login.ejs", { pageScript: "passwordTypeValidation.js" });
};

// 4. POST Route to login the user and redirect to the listings page
module.exports.loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      req.flash("error", "No account found with that email.");
      return res.redirect("/users/login");
    }

    req.login(user, function (err) {
      if (err) {
        req.flash("error", "Something went wrong with login.");
        return next(err);
      }
      req.flash(
        "success",
        `Welcome back ${req.user.username}❤️ in Beyond Borders! 🎉`
      );

      let redirectUrl = res.locals.redirectUrl || "/listings";
      return res.redirect(redirectUrl);
    });
  } catch (err) {
    return next(err);
  }
};

// 5. GET Route to Log out from this existing user.
module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
};

// 6. GET Route to display the user profile page
module.exports.userProfile = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  const listings = await Listing.find({ createdBy: userId });

  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/listings");
  }

  return res.render("./users/profile.ejs", { user, listings });
};

// 7. GET Settings Page
module.exports.userSetting = (req, res) => {
  return res.render("./users/settings.ejs", {
    currentUser: req.user,
    pageScript: "userSettingPage.js",
  });
};

// 8. User setting profile photo upload
module.exports.uploadProfilePhoto = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!req.file) {
    req.flash("error", "No file uploaded!");
    return res.redirect("/users/settings");
  }

  // ✅ Correct Cloudinary URL
  user.profileImage = req.file.path;
  await user.save();

  // ✅ Refresh session so image is shown immediately
  req.login(user, function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Profile photo updated successfully!");
    return res.redirect("/users/settings");
  });
};

// 9. DELETE User Account
// This function deletes the user account and all associated data
module.exports.deleteUserAccount = async (req, res, next) => {
  const { id } = req.params;
  const { confirmPassword } = req.body;

  const user = await User.findById(id);

  // Check password
  const isValid = await user.authenticate(confirmPassword);
  if (!isValid.user) {
    req.flash("error", "Incorrect password. Account NOT deleted.");
    return res.redirect("/users/settings");
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
    "Your account and all your data have been deleted permanently!"
  );
  return res.redirect("/");
};

// 10. GET Route to display the change password form
module.exports.userChangePasswordForm = (req, res) => {
  return res.render("./users/change-password.ejs", {
    pageScript: "passwordTypeValidation.js",
  });
};

// 11. POST Route to change the password
module.exports.userChangePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const isValid = await user.authenticate(currentPassword);
  if (!isValid.user) {
    req.flash("error", "Current password is incorrect.");
    return res.redirect("/users/change-password");
  }

  await user.setPassword(newPassword);
  await user.save();

  req.flash("success", "Password updated successfully!");
  return res.redirect("/users/settings");
};

// 12. GET Route to display the forget password form
module.exports.forgetPasswordForm = (req, res) => {
  return res.render("./users/forget-password.ejs");
};

// 13. POST Route to send the reset password link to the user's email
module.exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "No user found with that email.");
    return res.redirect("/users/forget-password");
  }

  const token = crypto.randomBytes(20).toString("hex");
  console.log(token);
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 10; // 10 minutes
  await user.save();

  // Setup Nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail
      pass: process.env.EMAIL_PASS, // Your Gmail App Password
    },
  });

  const resetUrl = `http://${req.headers.host}/users/reset-password/${token}`;

  const mailOptions = {
    to: user.email,
    from: "Beyond Borders Travel <your-email@gmail.com>",
    subject: "Password Reset Request",
    html: `<p>Hey ${user.username},</p>
           <p>You requested a password reset. Click here to reset your password:</p>
           <a href="${resetUrl}">${resetUrl}</a>
           <p>This link expires in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);

  req.flash("success", "Password reset link sent to your email! 📧");
  return res.redirect("/users/login");
};

// 14. GET Route to display the reset password form
module.exports.resetPasswordForm = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Password reset token is invalid or has expired.");
    return res.redirect("/users/forget-password");
  }

  return res.render("./users/reset-password.ejs", {
    token,
    pageScript: "passwordTypeValidation.js",
  });
};

// 15. POST Route to reset the password
module.exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Password reset token is invalid or has expired.");
    return res.redirect("/users/forget-password");
  }

  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match!");
    return res.redirect(`/users/reset-password/${token}`);
  }

  await user.setPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  req.flash("success", "Your password has been reset successfully!");
  return res.redirect("/users/login");
};
