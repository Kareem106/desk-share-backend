const mongoose = require("mongoose");
const Country = require("@models/country.model.js");
const City = require("@models/city.model.js");
const Admin = require("@models/admin.model.js");
const workspaceSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "workspace name is required"],
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Country",
    validate: {
      validator: async function (value) {
        const country = await Country.findById(value);
        return country !== null;
      },
      message: "Invalid country",
    },
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "City",
    validate: {
      validator: async function (value) {
        const city = await City.findById(value);
        return city !== null;
      },
      message: "Invalid city",
    },
  },
  address: {
    type: String,
    required: [true, "address is required"],
  },
  cover: {
    type: String,
    default: null,
  },
  images: {
    type: [
      {
        imgUrl: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "admin is required"],
    ref: "Admin",
  },
});
const WorkSpace = mongoose.model("workspaces", workspaceSchema);

module.exports = WorkSpace;
