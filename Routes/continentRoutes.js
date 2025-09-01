// Routes/continentRoutes.js
const express = require("express");
const continentController = require("../Controllers/continentController");
const {
  createContinent,
  getAllContinents,
  updateContinent,
  deleteContinent,
  getContinentWithRegions,
  getContinentWithCountries,
  getAllContinentsWithDetails,
} = continentController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", createContinent);
router.get("/:id/countries", getContinentWithCountries);
router.get("/:id/regions", getContinentWithRegions);
router.get("/", getAllContinents);
router.put("/:id", updateContinent);
router.delete("/:id", deleteContinent);
router.get("/all-with-details", getAllContinentsWithDetails);

module.exports = router;
