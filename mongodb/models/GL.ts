import mongoose, { Schema, Document } from "mongoose";

export interface IEntry {
  accountName: string;
  accountID: string;
  amount: number;
}

export interface IGeneralLedger extends Document {
  date: Date;
  description: string;
  debits: IEntry[];
  credits: IEntry[];
}

const newGeneralEntrySchema: Schema = new Schema({
  accountID: { type: String, required: true },
  amount: { type: Number, required: true },
});

const newGLSchema: Schema = new Schema(
  {
    date: { type: Date, required: true },
    description: { type: String, required: true },
    debits: { type: [newGeneralEntrySchema], required: true },
    credits: { type: [newGeneralEntrySchema], required: true },
    type: { type: String, required: true },
  },
  { strict: false }
);

export default mongoose.models.newGLSchema ||
  mongoose.model<IGeneralLedger>("newGLSchema", newGLSchema);
