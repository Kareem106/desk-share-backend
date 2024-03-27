const WorkSpace = require("@models/workspace.model.js");
const Country = require("@models/country.model.js");
const City = require("@models/city.model.js");
const { admin_post } = require("@controllers/admin.controllers.js");
const ImageKit = require("imagekit");
let imagekit = new ImageKit({
  publicKey: process.env.IMAGE_PUBLIC_KEY,
  privateKey: process.env.IMAGE_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_URL,
});

const workspaceResHandler = async (workspace) => {
  try {
    const country = await Country.findById(workspace.country);
    const city = await City.findById(workspace.city);
    const response = {
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
    return response;
  } catch (err) {
    throw err;
  }
};
const workspaces_get = async (req, res) => {
  try {
    const workspaces = await WorkSpace.find();
    if (workspaces) res.json(workspaces);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message, message: "could't find data" });
  }
};

const workspace_details = async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      const workspace = await WorkSpace.findById(id);
      if (workspace) {
        const country = await Country.findById(workspace.country);
        const city = await City.findById(workspace.city);
        const response = {
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
          cover: workspace.cover,
        };
        res.json(response);
        return;
      }
    }
    throw Error("invalid id");
  } catch (err) {
    res.status(404).json({ error: err.message, message: "could't find data" });
  }
};
module.exports = { workspaces_get, workspace_details };
