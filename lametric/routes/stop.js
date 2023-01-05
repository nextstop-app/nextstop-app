const express = require('express');
const { getStopIdIndex, getStopNameByIndex, getStopDataByIndex } = require('../db');
const { generateFrames } = require('../models/lametric');
const router = express.Router();


router.get('/status', function(req, res, next) {
    const stopId = req.query.stopId;

    getStopIdIndex(stopId, (dbIndex) => {
      getStopNameByIndex(dbIndex, (stopName) => {
        getStopDataByIndex(dbIndex, (stopData) => {
          res.json({
            stopId,
            stopName,
            stopData
          })
  
        })
      })
    })
});

router.get('/frames', function(req, res, next) {
    const stopId = req.query.stopId;

    getStopIdIndex(stopId, (dbIndex) => {
      getStopNameByIndex(dbIndex, (stopName) => {
        getStopDataByIndex(dbIndex, (stopData) => {
          res.json(generateFrames(stopData.trains))
        })
      })
    })
});
module.exports = router;
