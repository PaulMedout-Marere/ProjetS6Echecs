var express = require('express');
const CryptoJS = require('crypto-js');

var router = express.Router();
var Progress = require('../models/progressExerciseModel');
var User = require('../models/userModel');
const e = require('express');

// Get all progress
router.get('/', async (req, res) => {
  try {
    const progress = await Progress.getAllProgress();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single Progress by Name
router.get('/:name/:id', async (req, res) => {
  try {
    const progress = await Progress.getProgressByNameId(req.params.name, req.params.id);
    res.json(progress);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Update an existing Progress
router.put('/:name/:id', async (req, res) => {
  try {
    const progress = req.body;
    const name = req.params.name;
    const id = req.params.id;
    const updatedProgress = await Progress.updateProgress(req.params.name, req.params.id, progress);
    res.json(updatedProgress);
    res.status(405).json({ error: "Permission denied" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// change points to playeur in exercice Id
router.put('/change/:name/:id', async (req, res) => {
  try {
    const decoded = res.decoded;
    const nameParam = req.params.name;
    const idParam = req.params.id;
    const points = req.body.points;

    // recupere un code crypte du type name/id/pointsActuel/newPoints(- or +)
    const encrypted = req.body.encrypted;
    const message = CryptoJS.AES.decrypt(encrypted, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
    const parts = message.split('/');
    const nameMessage = parts[0];
    const idMessage = parts[1];
    const actualPointsMessage = parseInt(parts[2]);
    const newPointsMessage = parseInt(parts[3]);

    // Verification validity
    if (decoded.role == "admin") {
      const updatedProgress = await Progress.changePointsExercise(req.params.id, req.params.name, points);
      res.json(updatedProgress);
    }
    else if (nameParam == nameMessage == decoded.name && idParam == idMessage) { // Verif name and id
      const pointsProgress = await Progress.getPointsProgressByNameId(req.params.id, req.params.name);
      if ((pointsProgress == actualPointsMessage) && (points == newPointsMessage)) { // Verif points
        // change points to progress
        const changePoints = await Progress.changePointsExercise(req.params.id, req.params.name, pointsProgress + points);

        // change points to user elo
        const changeEloUser = await Progress.changePointsExercise(req.params.id, req.params.name, (newPointsMessage * 5) / 100);

        res.json({ changePoints, changeEloUser });
      }
      else {
        res.status(406).json({ error: "Points do not correspond" });
      }
    }
    else {
      res.status(405).json({ error: "Permission denied" });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
