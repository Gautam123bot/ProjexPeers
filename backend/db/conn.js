const mongoose = require("mongoose");

const DB = "mongodb://127.0.0.1:27017/teambuilder"

module.exports = async function connection (){
  try{
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    await mongoose.connect(DB,connectionParams).then(() => {
      console.log("Database connected successfully.");
    })
  }catch(e){
    console.log("Database connection error: ");
    console.log(e);
  }
}