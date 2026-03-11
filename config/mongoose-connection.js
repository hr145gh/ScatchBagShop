const mongoose= require("mongoose");
const config= require("config");

const dbgr= require("debug")("development: mongoose");   //we have made environment variables in terminal as(export DEBUG=development:*)

mongoose
.connect(`${config.get("MONGODB_URI")}/scatch`)   //we use backtick, to put the dynamic value
.then(function(){
    dbgr("connected");
})
.catch(function(err){
    dbgr(err);
})

module.exports= mongoose.connection;



//this is what we did separation of concerns here, as we have made another file for connecting to database, and rather not writing in every models folders