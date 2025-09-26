import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  receiver: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  read: boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = model<IMessage>("Message", messageSchema);