/**
 * uncaught exceptions
 * @param err
 */
module.exports = function(err){
    console.log('\n Caught exception:'+ err);
    response.status(500).json({error: "500 internal server error"});
};