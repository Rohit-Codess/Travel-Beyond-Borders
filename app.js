if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const adminRouter = require("./routes/admin.js");
const Listing = require("./models/listing.js");

const mongoDBUrl = process.env.ATLAS_DB_URL;
// const mongoDBUrl = "mongodb://127.0.0.1:27017/travel";
async function main() {
  mongoose.connect(mongoDBUrl)
}
main()
  .then((res) => {
    console.log("Connect DB to travel ATLAS DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl : mongoDBUrl,
  crypto : {
    secret : process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error" , () => {
  console.log("Found some error in mongo session", err);
})
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  },
};


// save session for user better experiance
app.use(session(sessionOption));
app.use(flash()); // display one time message

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Here show the flash message for every routes except main route
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Main Route Page
app.get("/", (req, res) => {
  res.render("./listings/main.ejs", {pageCSS: "main.css" });
});

// Make a user an admin
// User.findOneAndUpdate({ _id: "6800d9e36ee64a7685923c50"}, { isAdmin: true },{new : true}).then(console.log);

// Listings using Router
app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/users", userRouter);
app.use("/admin/users", adminRouter);

// 8. If No any Route Matched Then Execute this Route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// 9. Error Page for better way to display our errors
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
    if (err.code === 'LIMIT_FILE_SIZE') {
      req.flash("error", "File too large! Max 500KB allowed.");
      return res.redirect("back");
    }
    next(err);
    res.status(status).render("./listings/error.ejs", { err });
  // }
});

app.listen(8080, () => {
  console.log(`App is listing at port 8080`);
});
