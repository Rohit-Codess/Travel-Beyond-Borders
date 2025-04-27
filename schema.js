const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(10).max(100).required(),
    description: Joi.string().min(20).max(500).required(),
    price: Joi.number().min(0).required(),
    country: Joi.string().min(3).max(30).required(),
    location: Joi.string().min(3).max(30).required(),
    category: Joi.string().valid("waterfall", "forest", "resort", "mall", "temple", "lake", "zoo", "museum", "park","river"),

  }).required(),
});

module.exports.reviewSchema = Joi.object({
  comment: Joi.string().min(2).max(300).required(),
  rating: Joi.number().min(1).max(5).required(),
});
