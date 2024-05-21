const WorkSpace = require("@models/workspace.model.js");
const Admin = require("@models/admin.model.js");
const jwt = require("jsonwebtoken");
const Country = require("@models/country.model.js");
const City = require("@models/city.model.js");
const ImageKit = require("imagekit");
const mongoose = require("mongoose");
let imagekit = new ImageKit({
  publicKey: process.env.IMAGE_PUBLIC_KEY,
  privateKey: process.env.IMAGE_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_URL,
});
// const admin_post = async (name, email, password) => {
//   try {
//     const admin = new Admin({
//       name: `${name}'s admin`,
//       email,
//       password,
//       role: "admin",
//     });
//     await admin.validate();
//     const isUsed = await Admin.findOne({ email });
//     console.log(isUsed);
//     if (isUsed) {
//       const err = new Error("email is already registered");
//       err.code = 11000;
//       throw err;
//     }
//     if (admin) return admin;
//   } catch (err) {
//     throw err;
//   }
// };
//create token
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.SECRET || "SECRET");
};

//handle signup errors
const errHandler = (err) => {
  const errors = {};
  if (err.code === 11000) {
    errors.email = "email is already registered";
  } else {
    Object.values(err.errors).forEach((e) => {
      errors[e.path] = e.message.includes("Cast to ObjectId")
        ? "input is not in valid format"
        : e.message;
    });
  }
  return errors;
};

const admin_login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.login(email, password);
    const token = createToken(admin._id, admin.role);
    res.json({
      status: true,
      message: "logged in successfully",
      admin: {
        name: admin.name,
        email: admin.email,
      },
      token,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: false,
      message: "failed to login",
      error: err.message,
    });
  }
};
const admin_signup_post = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await Admin.create({ name, email, password, role: "admin" });
    const token = createToken(admin._id, admin.role);
    res.status(201).json({
      status: "true",
      message: "Account created",
      admin: {
        name: admin.name,
        email: admin.email,
      },
      token,
    });
  } catch (err) {
    const errors = errHandler(err);
    res.json({ status: "false", message: "failed to signup", errors });
  }
};
const admin_profile_put = async (req, res) => {
  const { name, email, password, admin } = req.body;
  try {
    const update = {
      name,
      email,
      password,
    };
    const document = await Admin.findByIdAndUpdate(admin, update, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "true",
      message: "profile updated",
      admin: {
        name: document.name,
        email: document.email,
      },
    });
  } catch (err) {
    console.log(err);
    const errors = errHandler(err);
    res
      .status(400)
      .json({ status: "false", message: "failed to update profile", errors });
  }
};
const admin_workspaces_post = async (req, res) => {
  let { name, country, city, address, admin } = req.body;
  try {
    const workspace = await WorkSpace.create({
      name,
      country,
      city,
      address,
      admin,
    });
    country = await Country.findById(workspace.country);
    city = await City.findById(workspace.city);
    const response = {
      status: "true",
      message: "workspace created",
      _id: workspace._id,
      name: workspace.name,
      country: {
        _id: country._id,
        name: country.name,
      },
      city: {
        _id: city._id,
        name: city.name,
      },
      address: workspace.address,
    };
    res.status(201).json(response);
  } catch (err) {
    const errors = errHandler(err);
    console.log(errors);
    res.status(400).json({
      status: "false",
      message: "couldn't add the workspace",
      errors,
    });
  }
};

const workspaceResHandler = (workspace) => {
  return {
    _id: workspace._id,
    name: workspace.name,
    country: {
      _id: workspace.country[0]._id,
      name: workspace.country[0].name,
    },
    city: {
      _id: workspace.city[0]._id,
      name: workspace.city[0].name,
    },
    address: workspace.address,
    cover: workspace.cover,
  };
};
const admin_workspaces_get = async (req, res) => {
  const admin_id = req.body.admin;
  try {
    const documents = await WorkSpace.aggregate([
      {
        $match: { admin: new mongoose.Types.ObjectId(admin_id) },
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "country",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "city",
        },
      },
    ]);
    if (documents.length > 0) {
      const response = documents.map((doc) => {
        console.log(doc);
        return workspaceResHandler(doc);
      });
      res.json({
        workspaces: response,
      });
    } else {
      throw Error("could't found workspaces");
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};
const admin_workspace_details = async (req, res) => {
  const workspace_id = req.params.id;
  const admin_id = req.body.admin;
  try {
    const document = await WorkSpace.aggregate([
      {
        $match: {
          $and: [
            { _id: new mongoose.Types.ObjectId(workspace_id) },
            { admin: new mongoose.Types.ObjectId(admin_id) },
          ],
        },
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "country",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "city",
        },
      },
    ]);
    if (document.length > 0) {
      const response = workspaceResHandler(document[0]);
      res.json(response);
    } else {
      throw Error("count't find workspace");
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
const admin_workspace_cover_post = async (req, res) => {
  try {
    const admin = await Admin.findById(req.body.admin);
    const workspace_id = req.params.id;
    if (admin.workspaces.includes(workspace_id)) {
      const file = req.file;
      imagekit.upload(
        {
          file: file.buffer, //required
          fileName: file.originalname, //required
          folder: workspace_id,
          tags: ["workspace"],
        },
        async function (error, result) {
          if (error) {
            throw Error("error while uploading the file");
          } else {
            console.log(result);
            res
              .status(201)
              .json({ message: "file uploaded", imgUrl: result.url });
            const workspace = await WorkSpace.findById(workspace_id);
            workspace.cover = result.url;
            workspace.save();
          }
        }
      );
    } else {
      throw Error("invalid id");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "failed to upload" });
  }
};
module.exports = {
  admin_signup_post,
  admin_login_post,
  admin_workspaces_post,
  admin_workspaces_get,
  admin_workspace_details,
  admin_workspace_cover_post,
  admin_profile_put,
};
