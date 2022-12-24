let passport = require('passport');
let AdvertisementModel = require('../models/advertisement.model');
let UserModel = require('../models/user.model');

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

// helper function for guard purposes
exports.requireAuth = function(req, res, next)
{
    passport.authenticate('tokencheck', { session: false }, 
        function(err, user, info) {
            if (err) return res.status(401).json(
            { 
                success: false, 
                message: getErrorMessage(err)
            }
            );
            if (info) return res.status(401).json(
            { 
                success: false, 
                message: info.message
            }
            );
            
            req.payload = user;
            next();
      })(req, res, next);
}


// Validates the owner of the item.
exports.isAllowed = async function (req, res, next){

    try {
        let id = req.params.id
   
        // Retrieve ownership
        let advertisementItem = await AdvertisementModel.findById(id).populate('owner');  

        // If there is no item found.
        if(advertisementItem == null){
            throw new Error('Advertisement not found.') // Express will catch this on its own.
        }
        else if(advertisementItem.owner != null){ // If the item found has a owner.

            if(advertisementItem.owner._id != req.payload.id){ // If the owner differs.
                
                let currentUser = await UserModel.findOne({_id: req.payload.id}, 'admin');

                if(currentUser.admin != true){ // If the user is not a Admin
                    
                    console.log('====> Not authorized');
                    return res.status(403).json(
                        { 
                            success: false, 
                            message: 'User is not authorized to modify this item.'
                        }
                    );
                }
            }        
        }

        // If it reaches this point, runs the next middleware.
        next();    
    } catch (error) {
        console.log(error);
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }
    
}
