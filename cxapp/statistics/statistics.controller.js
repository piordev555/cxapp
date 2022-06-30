const express = require("express");
const router = express.Router();
const statisticsService = require("./statistics.service");

// routes
router.get("/getStatistics", getStatisticsC);

module.exports = router;

function getStatisticsC(req, res, next) {
  statisticsService
    .getStatistics(req.body)
    .then((result) => (result ? res.json(result) : res.json({})))
    .catch((err) => next(err));
}
