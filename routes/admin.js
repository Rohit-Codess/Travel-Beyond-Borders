const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const { isAdmin, isLogedIn } = require("../middleware");
const {
  usersByAdminPage,
  deleteUsersByAdmin,
  adminDasboard,
  promoteUserToAdmin,
  demoteAdminToUser,
} = require("../controller/admins");

// 1. Show all users
router.get("/", isLogedIn, isAdmin, wrapAsync(usersByAdminPage));

// 2. Delete user by admin
router.delete("/:id", isLogedIn, isAdmin, wrapAsync(deleteUsersByAdmin));

// 3. Admin Dashboard Route
router.get("/dashboard", isLogedIn, isAdmin, wrapAsync(adminDasboard));

// 4. Promote a user to Admin
router.post("/:id/promote", isLogedIn, isAdmin, wrapAsync(promoteUserToAdmin));

// 5. Demote Admin to Normal User
router.post("/:id/demote", isLogedIn, isAdmin, wrapAsync(demoteAdminToUser));


module.exports = router;
