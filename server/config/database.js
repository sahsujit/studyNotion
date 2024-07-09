const mongoose =  require('mongoose');
require("dotenv").config();

exports.connectDb = () =>{
     mongoose.connect(process.env.MONGODB_URL, {
        // useNewUrlParser:true,
        // useNewUnifiedTopology:true,
    })
    .then(()=>console.log("Db  Connected Successfully"))
    .catch((error)=>{
        console.log("DB Connection Failed")
        console.error(error)
        process.exit(1);
    })
}