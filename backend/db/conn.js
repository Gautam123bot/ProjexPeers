import mongoose from "mongoose";

const dbUrl = "mongodb://mongo:27017/teambuilder";
console.log("your dburl is: ", dbUrl);

async function connectionToDb() {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(dbUrl, connectionParams).then(() => {
      console.log("Database connected successfully.");
    });
  } catch (e) {
    console.log("Database connection error: ");
    console.log(e);
  }
}

export default connectionToDb;
