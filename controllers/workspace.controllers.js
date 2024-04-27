const WorkSpace = require("@models/workspace.model.js");
const Country = require("@models/country.model.js");
const City = require("@models/city.model.js");
const mongoose = require("mongoose");
const { admin_post } = require("@controllers/admin.controllers.js");
const ImageKit = require("imagekit");
let imagekit = new ImageKit({
  publicKey: process.env.IMAGE_PUBLIC_KEY,
  privateKey: process.env.IMAGE_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_URL,
});

const workspaceResHandler = async (workspace) => {
  try {
    const response = {
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
    return response;
  } catch (err) {
    throw err;
  }
};
const workspaces_get = async (req, res) => {
  const search = req.query.q ? req.query.q.trim() : null;
  const limit = req.query.limit ? Number(req.query.limit) || 10 : 10;
  const skip = req.query.skip ? Number(req.query.skip) || 0 : 0;
  try {
    // const workspaces =
    //   search && search.length > 0
    //     ? await WorkSpace.find({ name: { $regex: new RegExp(search) } }).limit(
    //         limit
    //       )
    //     : await WorkSpace.find().limit(limit);
    const [
      {
        total: [{ total }],
        documents,
      },
    ] = await WorkSpace.aggregate([
      {
        $match: {
          name: {
            $regex: search && search.length > 0 ? new RegExp(search) : /^/,
            $options: "i",
          },
        },
      },
      {
        $facet: {
          total: [{ $count: "total" }],
          documents: [
            { $skip: skip },
            {
              $limit: limit,
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
          ],
        },
      },
    ]);
    // console.log(edges);
    console.log(total);
    console.log(documents);
    if (documents) {
      const workspacesRes = await Promise.all(
        documents.map(async (document) => await workspaceResHandler(document))
      );
      const response = {
        workspaces: workspacesRes,
        limit: limit,
        skip: skip,
        total: total,
      };
      res.json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message, message: "could't find data" });
  }
};

const workspace_details = async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      // const workspace = await WorkSpace.findById(id);
      const [workspace] = await WorkSpace.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
      if (workspace) {
        const response = await workspaceResHandler(workspace);
        res.json(response);
        return;
      }
    }
    throw Error("invalid id");
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message, message: "could't find data" });
  }
};
module.exports = { workspaces_get, workspace_details };
