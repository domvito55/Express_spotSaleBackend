const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisement.controller');
const authController = require('../controllers/auth.controller');
const expirationController = require('../controllers/expiration.controller');

// List advertisements
// Set potential expired Ads to disable after geting the advertisementList
router.get('/', advertisementController.advertisementList,
    expirationController.processExpiration4AdvList);

// Edit an advertisement
// Check expiration before Auth and ownership 
// Currently will still alter the Ad since the user has the ownership
router.put('/edit/:id', expirationController.processExpiration4Adv,
    authController.requireAuth, authController.isAllowed, 
    advertisementController.processEdit); 

// Delete an advertisement
router.delete('/delete/:id', authController.requireAuth, 
    authController.isAllowed, advertisementController.performDelete);

// Add advertisement
// router.get('/add', authController.requireAuth, advertisementController.displayAddPage);
router.post('/add', authController.requireAuth, advertisementController.processAdd);



module.exports = router;
