import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status : {
    type: String,
    enum : ["active","inactive"],
    default : "active",
    required : true,
  },
  createAt : {
    type : Number
  },
  updateAt : {
    type : Number
  },
},
{
  timestamps : {
    currentTime : () => Math.floor(Date.now() / 1000 ),
  },
}
);

export default mongoose.model("User", userSchema)