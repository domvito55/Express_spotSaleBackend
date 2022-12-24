const e = require("connect-flash");
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

// Add new QA, get from backend to reduce the req.body length
module.exports.processAddQuestion = async (req, res, next) => {
    try {
        let advertisementID = req.params.id;
        let newQuestionAnswerArray = [];
        let curQuestion = req.body.question;

        // console.log(curQuestion);

        // Get the current Ad
        var curAdvertisement = await advertisementModel.findById(advertisementID);
        if (curAdvertisement == null){
            throw new Error('Advertisement not found.') // Express will catch this on its own.
        }else if(curAdvertisement.questionAnswer == null){
            throw new Error('questionAnswer Array not found.'); 
        }else{
            let curQuestionAnswerArray = curAdvertisement.questionAnswer;
            // Push the new qa to the start 
            curQuestionAnswerArray.unshift(
                {
                    question:curQuestion,
                    // By default, the new QA only got empty string
                    answer: ""
                }
            );
            //assign to the newQuestionAnswerArray
            newQuestionAnswerArray = curQuestionAnswerArray;
            // console.log(newQuestionAnswerArray);
        }
        
        // Locate and update the questionAnswer field by the advertisementID 
        advertisementModel.findByIdAndUpdate(advertisementID, 
            {questionAnswer: newQuestionAnswerArray},
            function (err, docs) {
                if (err){
                    console.log(err)
                    return res.status(400).json(
                        { 
                            success: false, 
                            message: getErrorMessage(err)
                        }
                    );
                }
                else{
                    // console.log("Added Advertisement:Question : ", docs);
                    return res.status(200).json(
                        {
                            success: true,
                            message: 'Advertisement/Question added successfully.'
                        }
                    );
                }
            }
        );

    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }   
    
}


// Edit answer, get from backend to reduce the req.body length
module.exports.processEditAnswer = async (req, res, next) => {
    try {
        let advertisementID = req.params.id;
        let qaID = req.params.qaid;
        let newAnswer = req.body.answer;
        let newQustionAnswerArray = [];

        // Get the current Ad
        var curAdvertisement = await advertisementModel.findById(advertisementID);
        if (curAdvertisement == null){
            throw new Error('Advertisement not found.'); 
        }else if(curAdvertisement.questionAnswer == null || curAdvertisement.questionAnswer == []){
            throw new Error('questionAnswer Array not found.'); 
        }else{
            let curQuestionAnswerArray = curAdvertisement.questionAnswer;
            let isFound = false;
            // Edit the answer for current Q&A item   
            // newQustionAnswerArray = curQuestionAnswerArray.map(e => {
            //     if(e._id == qaID){
            //         e.answer = newAnswer;
            //     }
            //     e;
            // });
            for (let i = 0;i < curQuestionAnswerArray.length; i++){
                let cur = curQuestionAnswerArray[i];
                if (cur._id == qaID){
                    cur.answer = newAnswer;
                    isFound = true;
                    break;
                }
            }

            if(isFound == false){
                throw new Error('Q&A item not found.'); 
            }else{
                newQustionAnswerArray = curQuestionAnswerArray;
            }
        }
        
        // Locate and update the questionAnswer field by the advertisementID 
        advertisementModel.findByIdAndUpdate(advertisementID, 
            {questionAnswer: newQustionAnswerArray},
            function (err, docs) {
                if (err){
                    console.log(err)
                    return res.status(400).json(
                        { 
                            success: false, 
                            message: getErrorMessage(err)
                        }
                    );
                }
                else{
                    // console.log("Updated Advertisement/Answer : ", docs);
                    return res.status(200).json(
                        {
                            success: true,
                            message: 'Advertisement/Answer updated successfully.'
                        }
                    );
                }
            }
        );

    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }   
    
}


// Edit answer, get from backend to reduce the req.body length
module.exports.processDeleteQA = async (req, res, next) => {
    try {
        let advertisementID = req.params.id;
        let qaID = req.params.qaid;
        let newQustionAnswerArray = [];

        // Get the current Ad
        var curAdvertisement = await advertisementModel.findById(advertisementID);
        if (curAdvertisement == null){
            throw new Error('Advertisement not found.'); 
        }else if(curAdvertisement.questionAnswer == null || curAdvertisement.questionAnswer == []){
            throw new Error('questionAnswer Array not found.'); 
        }else{
            let curQuestionAnswerArray = curAdvertisement.questionAnswer;
            let isFound = false;
            
            for (let i = 0;i < curQuestionAnswerArray.length; i++){
                let cur = curQuestionAnswerArray[i];
                if (cur._id == qaID){
                    // remove the ith QA item
                    curQuestionAnswerArray.splice(i,1);
                    // assign to newQuestionAnswerArray
                    newQustionAnswerArray = curQuestionAnswerArray;
                    // console.log("newQustionAnswerArray: " ,newQustionAnswerArray);
                    isFound = true;
                    break;
                }
            }
            
            if(isFound == false){
                throw new Error('Q&A item not found.'); 
            }
        }
        
        // Locate and update the questionAnswer field by the advertisementID 
        advertisementModel.findByIdAndUpdate(advertisementID, 
            {questionAnswer: newQustionAnswerArray},
            function (err, docs) {
                if (err){
                    console.log(err)
                    return res.status(400).json(
                        { 
                            success: false, 
                            message: getErrorMessage(err)
                        }
                    );
                }
                else{
                    // console.log("Deleted Advertisement:QA : ", docs);
                    return res.status(200).json(
                        {
                            success: true,
                            message: 'Advertisement/QA deleted successfully.'
                        }
                    );
                }
            }
        );

    } catch (error) {
        return res.status(400).json(
            { 
                success: false, 
                message: getErrorMessage(error)
            }
        );
    }   
    
}
