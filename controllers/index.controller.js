
module.exports.landing = function(req, res, next) {
    try{
        return res.json(
            {
                success: true, 
                message: 'Landing successfully!'
            }
        ); 
    }
    catch(err){
        if (err) {
            let message = getErrorMessage(err);
    
            return res.status(400).json(
                {
                    success: false, 
                    message: message
                }
            );
        }
    }
};