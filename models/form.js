import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  questions : {
    type : Array
  },
  invites : {
    type: Array
  },
  public : {
    type: Boolean
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

Schema.plugin(mongoosePaginate)

export default mongoose.model("Form", Schema)