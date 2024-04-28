const Reservation = require("@models/reservation.model.js");
const { response } = require("express");
const mongoose = require("mongoose");
const user_reservation_post = async (req, res) => {
  const { user_id, workspace_id, date } = req.body;
  try {
    const reservation = await Reservation.create({
      user_id,
      workspace_id,
      date,
    });
    res.status(201).json({
      message: "created successfully",
      _id: reservation._id,
      date: reservation.date,
      status: reservation.status,
    });
  } catch (err) {
    console.log(err);
    const errors = {};
    Object.values(err.errors).forEach((e) => {
      errors[e.path] = e.message;
    });
    res.status(400).json({ status: "failed", errors });
  }
};
const user_reservation_get = async (req, res) => {
  const user_id = req.body.user_id;
  try {
    const reservations = await Reservation.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(user_id) },
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace_id",
          foreignField: "_id",
          as: "workspace",
        },
      },
    ]);
    if (reservations) {
      const response = {
        reservations: reservations.map((e) => ({
          _id: e._id,
          date: e.date,
          status: e.status,
          workspace: (function (workspace) {
            return {
              _id: workspace?._id,
              name: workspace?.name,
              address: workspace?.address,
              cover: workspace?.cover,
            };
          })(e.workspace[0]),
        })),
      };
      res.json(response);
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
const admin_reservations_get = async (req, res) => {
  const id = req.params.id;
  const status = req.query.status ? req.query.status.trim() : null;
  try {
    const documents = await Reservation.aggregate([
      {
        $match: {
          $and: [
            { workspace_id: new mongoose.Types.ObjectId(id) },
            { status: status ? status : /^/ },
          ],
        },
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace_id",
          foreignField: "_id",
          as: "workspace",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);
    if (documents) {
      const reservations = documents.map((e) => ({
        _id: e._id,
        date: e.date,
        status: e.status,
        workspace: {
          _id: e.workspace[0]._id,
          name: e.workspace[0].name,
        },
        user: {
          _id: e.user[0]._id,
          name: e.user[0].name,
        },
      }));
      res.json({
        reservations,
      });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
const admin_reservation_accept = async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Reservation.findByIdAndUpdate(id, {
      status: "accepted",
    });
    if (document) {
      res.status(204).send();
    }
  } catch (err) {
    res.status(404).json({ error: "invalid id" });
  }
};
const admin_reservation_reject = async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Reservation.findByIdAndUpdate(id, {
      status: "rejected",
    });
    if (document) {
      res.status(204).send();
    }
  } catch (err) {
    res.status(404).json({ error: "invalid id" });
  }
};
module.exports = {
  user_reservation_post,
  user_reservation_get,
  admin_reservations_get,
  admin_reservation_accept,
  admin_reservation_reject,
};
