import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  service: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
}

const TransactionSchema: Schema = new Schema({
  service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  status: { type: String, required: true, default: "progress" },
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
