const Country = require("@models/country.model.js");
const City = require("@models/city.model.js");
const mongoose = require("mongoose");
const countries_get = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};
const country_get_details = async (req, res) => {
  const id = req.params.id;
  try {
    if (id && id.trim() !== "") {
      const country = await Country.findById(id);
      if (country) {
        res.json(country);
        return;
      }
    }
    throw Error("invalid id");
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "invalid id" });
  }
};
const countries_post = (req, res) => {};
const cities_get = async (req, res) => {
  const { country_id } = req.query;
  try {
    if (country_id && country_id.trim() !== "") {
      const cities = await City.find({
        country_id: country_id,
      });
      if (cities.length > 0) {
        res.json(cities);
      } else {
        throw Error("invalid country id");
      }
    } else {
      const cities = await City.find();
      res.json(cities);
    }
  } catch (err) {
    const error = err.message.includes("Cast to ObjectId")
      ? "invalid id format"
      : err.message;
    res.status(error === "invalid id format" ? 400 : 404).json({ error });
  }
};
const cities_post = (req, rest) => {};

module.exports = {
  countries_get,
  country_get_details,
  countries_post,
  cities_get,
  cities_post,
};
