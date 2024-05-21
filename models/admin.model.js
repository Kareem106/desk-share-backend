const mongoose = require("mongoose");
const WorkSpace = require("@models/workspace.model.js");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      unique: [true, "email is already registerd"],
      required: [true, "email is required"],
      lowercase: true,
      validate: [isEmail, "email is not valid"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: [6, "minimum password length is 6"],
    },
    role: {
      type: String,
      required: [true, "admin role is required"],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
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
adminSchema.pre("save", hashNewPassword);
adminSchema.pre("findOneAndUpdate", hashUpdatePassword);

adminSchema.statics.login = async function (email, password) {
  const admin = await this.findOne({ email });
  if (admin) {
    const auth = await bcrypt.compare(password, admin.password);
    if (auth) {
      return admin;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const Admin = mongoose.model("admins", adminSchema);
module.exports = Admin;
