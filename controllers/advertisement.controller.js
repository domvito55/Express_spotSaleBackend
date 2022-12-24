const mongoose = require('mongoose');
const Advertisement = require('../models/advertisement.model');
const datetool = require('../tools/date.tool');

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

// List advertisement list
module.exports.advertisementList = async function(req, res, next) {  

    try {
        let advertisementList = await Advertisement.find().populate({
            path: 'category',
            select: 'category title'
        });

        /*
        The res.locals is an object that contains the local variables for 
        the response which are scoped to the request only and 
        therefore just available for the views rendered during that 
        request or response cycle.
        */
        // Set advertisementList into res.locals for next midware
        res.locals.adList = advertisementList;
        res.status(200).json(advertisementList);
        
    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }
    next();
}


// Add advertisement
module.exports.processAdd = (req, res, next) => {

    try {

        /* By default, the sold and enable remains false when created*/
        var questionAnswerArray = []
        let newAdvertisement = Advertisement({
            _id: req.body.id,
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            condition: req.body.condition,
            imageURL: req.body.imageURL,
            price: req.body.price,
            sold: (req.body.sold == null || req.body.sold == "")? false : true,
            // sold: false,
            enable: (req.body.enable == null || req.body.enable == "")? false : true,
            // enable: true,
            deliveryMethod: req.body.deliveryMethod,
            creationDate: Date.now(),
            publishedDate: req.body.publishedDate,
            // By default, set 10 days after current date
            expiryDate: (req.body.expiryDate == null || req.body.expiryDate == "")? 
                datetool.addDays(Date.now(),10): 
                req.body.expiryDate,
            userName: req.body.userName,
            questionAnswer: (req.body.questionAnswer == null || req.body.questionAnswer == [])?
                []:
                req.body.questionAnswer,
             // If it does not have an owner it assumes the ownership otherwise it assigns it.
             owner: (req.body.owner == null || req.body.owner == "") ? req.payload.id : req.body.owner
        });

        Advertisement.create(newAdvertisement, (err, adv) =>{
            if(err)
            {
                console.log(err);

                return res.status(400).json(
                    { 
                        success: false, 
                        message: getErrorMessage(err)
                    }
                );
            }
            else
            {
                console.log(adv);
                res.status(200).json(adv);
            }
        });
    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }   
    
}


// Upate advertisement
module.exports.processEdit = async (req,res,next) => {
    try {
        let id = req.params.id;
        // console.log(req.body);
        
        let original = await Advertisement.findById(id);;
        if(original == null){
            throw new Error("Advertisement not found.");
        }

        /*
        !!!!
        All false , 0 , empty strings '' and "" , NaN , 
        undefined , and null are always evaluated as false ; everything else is true
        === equal value and equal type
        */
        // console.log((req.body.enable == "")); console.log((req.body.enable == null));

        /* By default, the sold and enable remains false when created*/
        let updatedAdvertisement = Advertisement({
            _id: id,
            category: (req.body.category == null || req.body.category == "")? 
                original.category : req.body.category,
            title: (req.body.title == null || req.body.title == "")? 
                original.title : req.body.title,
            description: (req.body.description == null || req.body.description == "")? 
                original.description : req.body.description,
            condition: (req.body.condition == null || req.body.condition == "")? 
                original.condition : req.body.condition,
            imageURL: (req.body.imageURL == null || req.body.imageURL == "")? 
                original.imageURL : req.body.imageURL,
            price: (req.body.price == null || req.body.price == "")? 
                original.price : req.body.price,
            sold: ((req.body.sold === false || req.body.sold === 'false')?
                  false : 
                  (req.body.sold === true || req.body.sold === 'true') ?
                  true :
                  original.sold),
            enable: ((req.body.enable === false || req.body.enable === 'false')? 
                    false : 
                    (req.body.enable === true || req.body.enable === 'true') ?
                    true :
                    original.enable),
            deliveryMethod: (req.body.deliveryMethod == null || req.body.deliveryMethod == "")? 
                original.deliveryMethod : req.body.deliveryMethod,
            creationDate: (req.body.creationDate == null || req.body.creationDate == "")? 
                original.creationDate : req.body.creationDate,
            publishedDate: (req.body.publishedDate == null || req.body.publishedDate == "")? 
                original.publishedDate : req.body.publishedDate,
            expiryDate: (req.body.expiryDate == null || req.body.expiryDate == "")? 
                original.expiryDate : req.body.expiryDate,
            userName: (req.body.userName == null || req.body.userName == "")? 
                original.userName : req.body.userName,
            questionAnswer: (req.body.questionAnswer == null || req.body.questionAnswer == "")? 
                original.questionAnswer : req.body.questionAnswer,
            // If it does not have an owner it assumes the ownership otherwise it assigns it.
            // In case of admin handles Advertisement that belongs to no one
            owner: (req.body.owner == null || req.body.owner == "")? 
                req.payload.id : req.body.owner
        });
    
        Advertisement.updateOne({_id: id}, updatedAdvertisement, (err) => {
            if(err)
            {
                console.log(err);
 
                return res.status(400).json(
                    { 
                        success: false, 
                        message: getErrorMessage(err)
                    }
                );
            }
            else
            {
                res.status(200).json(
                    {
                        success: true,
                        message: 'Advertisement updated successfully.'
                    }
                )
            }
        });
    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }
}



// Delete advertisement
module.exports.performDelete = (req, res, next) => {

    try {
        let id = req.params.id;
        
        Advertisement.deleteOne({_id: id}, (err) => {
            // check invalid id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                // return Error({ status: 422 })
                return res.status(422).json(
                    {
                        success: false,
                        message: 'Invalid _id: ' + id
                    }
                );
            }
            if(err) {
                console.log(err);
                return res.status(400).json(
                    { 
                        success: false, 
                        message: getErrorMessage(err)
                    }
                );
            } else {
                res.status(200).json(
                    {
                        success: true,
                        message: 'Advertisement deleted successfully.'
                    }
                )
            }
        });
    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }

}