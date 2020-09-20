import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: Date,
  received: Boolean,
  roomId: String
});
export default mongoose.model("messagecontents", whatsappSchema);
