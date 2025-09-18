import mongoose, { Document, Types } from "mongoose";
import { ConnectionStatus } from "../types/connection.types";

interface IConnection extends Document {
    _id: Types.ObjectId;
    fromUserId: Types.ObjectId;
    toUserId: Types.ObjectId;
    status: ConnectionStatus;
}

const connectionSchema = new mongoose.Schema<IConnection>(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: {
                values: [ConnectionStatus.ACCEPTED, ConnectionStatus.REJECTED, ConnectionStatus.PENDING, ConnectionStatus.BLOCKED],
                message: `{VALUE} is incorrect status type`,
            },
            required: true,
        },
    },
    { timestamps: true }
);

connectionSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });


connectionSchema.pre('save', function (next) {
    const newConnection = this;
    if (newConnection.fromUserId.toString() === newConnection.toUserId.toString()) {
        const error = new Error('invalid request, cant send connection to oneself');
        return next(error);
    }

    if (this.fromUserId.toString() > this.toUserId.toString()) {
        const temp = this.fromUserId;
        this.fromUserId = this.toUserId;
        this.toUserId = temp;
    }

    next()
})

export const Connection = mongoose.model<IConnection>("Connection", connectionSchema);