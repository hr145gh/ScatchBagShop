const mongoose= require('mongoose');

mongoose
.connect("mongodb://127.0.0.1:27017/scatch")
.then(function(){
    console.log("connected");
})
.catch(function(err){
    console.log(err);
})

module.exports= mongoose.connection;



//this is what we did separation of concerns here, as we have made another file for connecting to database, and rather not writing in every models folders