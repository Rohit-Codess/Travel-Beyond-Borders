const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage, limits: { fileSize: 500 * 1024 } });
const { saveRedirectUrl, isLogedIn } = require("../middleware.js");
const {
  signupForm,
  signupUser,
  loginForm,
  loginUser,
  logoutUser,
  userSetting,
  uploadProfilePhoto,
  deleteUserAccount,
  userChangePasswordForm,
  userChangePassword,
  userProfile,
  forgetPasswordForm,
  forgetPassword,
  resetPasswordForm,
  resetPassword,
} = require("../controller/users.js");

router.route("/signup").get(wrapAsync(signupForm)).post(wrapAsync(signupUser));

router
  .route("/login")
  .get(wrapAsync(loginForm))
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/users/login",
    }),
    isLogedIn,
    wrapAsync(loginUser)
  );

router.route("/forget-password")
.get(wrapAsync(forgetPasswordForm))
.post(wrapAsync(forgetPassword));


router
  .route("/reset-password/:token")
  .get(wrapAsync(resetPasswordForm))
  .post(wrapAsync(resetPassword));

router.get("/:userId/profile", isLogedIn, wrapAsync(userProfile));
router.get("/logout", logoutUser);

router.get("/settings", isLogedIn, wrapAsync(userSetting));

router.post(
  "/:id/upload-photo",
  isLogedIn,
  upload.single("profileImage"),
  wrapAsync(uploadProfilePhoto)
);

router.delete("/:id", isLogedIn, wrapAsync(deleteUserAccount));

router
  .route("/change-password")
  .get(isLogedIn, wrapAsync(userChangePasswordForm))
  .post(isLogedIn, wrapAsync(userChangePassword));

module.exports = router;
