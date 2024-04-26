const mongoose = require("mongoose");
const User = require("@models/user.model.js");
const WorkSpace = require("@models/workspace.model.js");
const reservationSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: [true, "user id is required"],
    ref: "User",
    validate: {
      validator: async function (value) {
        const user = await User.findById(value);
        return user !== null;
      },
      message: "invalid user id",
    },
  },
  workspace_id: {
    type: mongoose.Types.ObjectId,
    required: [true, "user id is required"],
    ref: "WorkSpace",
    validate: {
      validator: async function (value) {
        const workspace = await WorkSpace.findById(value);
        return workspace !== null;
      },
      message: "invalid workspace id",
    },
  },
  date: {
    type: Date,
    required: [true, "date is required"],
  },
  status: {
    type: String,
    default: "pending",
  },
});

const Reservation = mongoose.model("reservations", reservationSchema);
module.exports = Reservation;
