const mongoose = require('mongoose');
const advertisementModel = require("../models/advertisement.model");

function getErrorMessage(err) {    
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } 
    if (err.message) {
        return err.message;
    } else {
        return 'Unknown server error';
    }
};


// Detect expiryDate then edit 'enable' 
// Following previous midware that contains adList
module.exports.processExpiration4AdvList = async (req, res, next) => {
    try {
        /*
        The res.locals is an object that contains the local variables for 
        the response which are scoped to the request only and 
        therefore just available for the views rendered during that 
        request or response cycle.
        */
        // Get from previous midware
        let advertisementList = res.locals.adList;

        // Check expiryDate
        var curAdvertisementList = advertisementList;
       if(curAdvertisementList == null || curAdvertisementList == []){
            throw new Error('AdvertisementList not found.'); 
        }else{
            // Detect expired Ads
            let isInvalidDate = false;
            let invalidExpirationDateID;
            let adsToBeAltered = curAdvertisementList
                .filter(ad => {
                    // equals null or empty Date
                    if(ad.expiryDate == null || isNaN(ad.expiryDate.getTime())){
                        isInvalid = true;
                        invalidExpirationDateID = ad._id;
                        return false;
                    }else if(ad.expiryDate < Date.now()){
                        return true;
                    }else{
                        return false;
                    }
                });
                // .map(ad => ad.enable = false);
            
            if(isInvalidDate == true){
                throw new Error('Invalid ExpiryDate, _id: ' + invalidExpirationDateID);
            }else if(adsToBeAltered != null || adsToBeAltered != []){
                // Update the advertisements for 'enable'
                // const result = await 
                advertisementModel.updateMany(
                    {
                        _id: { $in: adsToBeAltered.map((ad) => ad._id) },
                    }, 
                    {
                        $set: { enable: false, },
                    },
                    (err) => {
                        if(err)
                        {
                            // console.log(err);
             
                            return res.status(400).json(
                                { 
                                    success: false, 
                                    message: getErrorMessage(err)
                                }
                            );
                        }
                    }
                );
                next();
            }else{
                // No expired Ads 
                next();
            }
            //   console.log(result);
        }
    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }   
    
};


// Detect expirationDate then edit 'enable'
module.exports.processExpiration4Adv = async (req, res, next) => {
    try {
        let advertisementID = req.params.id;

        // Get the current Ad
        var curAdvertisement = await advertisementModel.findById(advertisementID);
        if (curAdvertisement == null){
            throw new Error('Advertisement not found.'); 
        }else{
            // equals null or empty Date
            if(curAdvertisement.expiryDate == null || 
                isNaN(curAdvertisement.expiryDate.getTime())){
                throw new Error('Invalid ExpiryDate, _id: ' + advertisementID);
            }else if(curAdvertisement.expiryDate < Date.now()){
                // Locate and update the 'enable' field to false by the advertisementID 
                advertisementModel.findByIdAndUpdate(advertisementID, 
                    {enable: false},
                    function (err, docs) {
                        if (err){
                            // console.log(err)
                            return res.status(400).json(
                                { 
                                    success: false, 
                                    message: getErrorMessage(err)
                                }
                            );
                        }
                    }
                );
                next();
            }else{
                // Not expired Ad
                next();
            }
        }
    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }   
    
};
