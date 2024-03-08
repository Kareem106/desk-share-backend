const mongoose = require("mongoose");

//create city schema
const citySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const City = mongoose.model("cities", citySchema);

module.exports = City;
