const { Router } = require("express");
const router = Router();
const {
  countries_get,
  country_get_details,
  cities_get,
} = require("@controllers/api.controllers.js");
router.get("/countries", countries_get);
router.get("/countries/:id", country_get_details);
router.get("/cities", cities_get);
module.exports = router;
