import mongoose from "mongoose";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const connection = () => {
  mongoose
    .connect(env.MONGODB_URI, {
      dbName: env.MONGODB_NAME,
    })
    .then(() => {
      console.log("MongoDB connected, db name : ", env.MONGODB_NAME);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connection;