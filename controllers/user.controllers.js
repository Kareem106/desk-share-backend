const User = require("@models/user.model.js");
const mongoose = require("mongoose");
const WorkSpace = require("@models/workspace.model.js");
const errHandler = (err) => {
  const errors = {};
  if (err.code === 11000) {
    errors.email = "email is already registered";
  } else {
    Object.values(err.errors).forEach((e) => {
      errors[e.path] = e.message;
    });
  }
  return errors;
};
const user_profile_get = async (req, res) => {
  const { user_id } = req.body;
  try {
    const [document] = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user_id),
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
      {
        $addFields: {
          country: {
            $arrayElemAt: ["$country", 0],
          },
          city: {
            $arrayElemAt: ["$city", 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          country: {
            $first: {
              name: "$country.name",
              _id: "$country._id",
            },
          },
          city: {
            $first: {
              name: "$city.name",
              _id: "$city._id",
            },
          },
          created_at: { $first: "$created_at" },
        },
      },
    ]);
    if (!document || document.length < 1) {
      throw Error("invalid id");
    }
    console.log(document);
    res.json({
      status: "true",
      message: "profile found",
      user: document,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "false", message: err.message });
  }
};
const user_profile_put = async (req, res) => {
  const { name, email, password, country, city, user_id } = req.body;
  console.log(user_id);
  try {
    const update = {
      name,
      email,
      password,
      country,
      city,
    };
    const user = await User.findByIdAndUpdate(user_id, update, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw Error("invalid user");
    }
    const [document] = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user._id),
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
      {
        $addFields: {
          country: {
            $arrayElemAt: ["$country", 0],
          },
          city: {
            $arrayElemAt: ["$city", 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          country: {
            $first: {
              name: "$country.name",
              _id: "$country._id",
            },
          },
          city: {
            $first: {
              name: "$city.name",
              _id: "$city._id",
            },
          },
          created_at: { $first: "$created_at" },
        },
      },
    ]);
    if (!document || document.length < 1) {
      throw Error("invalid id");
    }
    console.log(document);
    res.status(201).json({
      status: "true",
      message: "profile updated",
      user: document,
    });
  } catch (err) {
    console.log(err);
    const errors = errHandler(err);
    res
      .status(400)
      .json({ status: "false", message: "failed to update profile", errors });
  }
};
const user_favorites_post = async (req, res) => {
  const { user_id } = req.body;
  const workspace_id = req.params.id;
  try {
    const user_document = await User.findById(user_id);
    if (!user_document) {
      throw Error("invalid user id");
    }
    if (user_document.favorites.includes(workspace_id)) {
      throw Error("workspace already added to favorites");
    }
    const workspace_document = await WorkSpace.findById(workspace_id);
    if (!workspace_document) {
      throw Error("invalid workspace id");
    }
    user_document.favorites.push(workspace_id);
    user_document.save();
    res.status(201).json({
      status: "true",
      message: "workspace added to favorites",
    });
  } catch (err) {
    console.log(err);
    if (err.message === "workspace already added to favorites") {
      res.status(400).json({ status: "false", message: err.message });
    } else {
      res.status(404).json({ status: "false", message: err.message });
    }
  }
};
const user_favorites_get = async (req, res) => {
  const { user_id } = req.body;
  try {
    const [document] = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(user_id) } },
      {
        $lookup: {
          from: "workspaces",
          localField: "favorites",
          foreignField: "_id",
          as: "favorites",
        },
      },
      {
        $unwind: "$favorites",
      },
      {
        $lookup: {
          from: "countries",
          localField: "favorites.country",
          foreignField: "_id",
          as: "favorites.country",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "favorites.city",
          foreignField: "_id",
          as: "favorites.city",
        },
      },
      {
        $addFields: {
          "favorites.country": {
            $arrayElemAt: ["$favorites.country", 0],
          },
          "favorites.city": {
            $arrayElemAt: ["$favorites.city", 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          favorites: {
            $push: {
              _id: "$favorites._id",
              name: "$favorites.name",
              country: {
                name: "$favorites.country.name",
                _id: "$favorites.country._id",
              },
              city: {
                name: "$favorites.city.name",
                _id: "$favorites.city._id",
              },
              address: "$favorites.address",
              cover: "$favorites.cover",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    console.log(document);
    const response = document ? document : { favorites: [] };
    console.log(response);
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "false", message: err.message });
  }
};
const user_favorites_delete = async (req, res) => {
  const { user_id } = req.body;
  const workspace_id = req.params.id;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      throw Error("invalid user id");
    }
    if (!user.favorites.includes(workspace_id)) {
      throw Error("workspace not found in favorites");
    }
    user.favorites = user.favorites.filter(
      (e) => e.toString() !== workspace_id
    );
    await user.save();
    res
      .status(201)
      .json({ status: "true", message: "workspace removed from favorites" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "false", message: err.message });
  }
};
module.exports = {
  user_profile_put,
  user_profile_get,
  user_favorites_post,
  user_favorites_get,
  user_favorites_delete,
};
