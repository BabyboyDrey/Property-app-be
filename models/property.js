const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  name: String,
  address: String,
  price: String,
  propertyType: String,
  imageUrl: String,
});

module.exports = mongoose.model("Property", propertySchema);
