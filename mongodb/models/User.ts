import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  photo: string;
  role: string; // e.g., 'admin', 'barber', 'customer'
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String },
  role: {
    type: String,
    required: true,
    enum: ["admin", "barber", "customer"],
    default: "barber",
  },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
