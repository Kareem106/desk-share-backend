const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const Country = require("@models/country.model.js");
const City = require("@models/city.model.js");
const WorkSpace = require("@models/workspace.model.js");
//create user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "email is not valid"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: [6, "minimum password length is 6"],
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: [true, "country field is required"],
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
      ref: "City",
      required: [true, "City field is required"],
      validate: {
        validator: async function (value) {
          const city = await City.findById(value);
          return city !== null;
        },
        message: "Invalid city",
      },
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "WorkSpace",
      default: [],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

//hashing password
async function hashNewPassword(next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
}
async function hashUpdatePassword(next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt();
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
}
userSchema.pre("save", hashNewPassword);
userSchema.pre("findOneAndUpdate", hashUpdatePassword);

// user login static function
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};
//create user model
const User = mongoose.model("users", userSchema);
module.exports = User;
