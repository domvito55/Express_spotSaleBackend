const express = require('express');
const router = express.Router();
const qaController = require('../controllers/qa.controller');
const authController = require('../controllers/auth.controller');

// posting quesion requires no login and ownership
router.put('/add/:id',qaController.processAddQuestion);

// posting answer requires both login and ownership
router.put('/edit/:id/:qaid',authController.requireAuth,
    authController.isAllowed,qaController.processEditAnswer); 

// deleting one QA obj requires both login and ownership
router.delete('/delete/:id/:qaid',authController.requireAuth,
    authController.isAllowed,qaController.processDeleteQA);

module.exports = router;

