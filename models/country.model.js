const mongoose = require("mongoose");
const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
});
const Country = mongoose.model("countries", countrySchema);
module.exports = Country;
