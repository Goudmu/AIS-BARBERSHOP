import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string; // e.g., 'admin', 'barber'
}

const UserSchema: Schema = new Schema({
  clerkId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  photo: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "barber", "customer"],
    default: "barber",
  },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
