import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const dbUrl = process.env.MONGO_URI;

async function connectionToDb() {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    console.log("dburl is: ", dbUrl);
    await mongoose.connect(dbUrl, connectionParams).then(() => {
      console.log("Database connected successfully.");
    });
  } catch (e) {
    console.log("Database connection error: ");
    console.log(e);
  }
}

export default connectionToDb;
