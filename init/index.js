const mongoose = require("mongoose");
const initData = require("../init/data");
const Listing = require("../models/listing");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/travel");
}

main()
  .then((res) => {
    console.log("Connected to travel DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    createdBy: "6800d9e36ee64a7685923c50",
  }));
  await Listing.insertMany(initData.data);

  console.log("data was initialized");
};

initDB();
