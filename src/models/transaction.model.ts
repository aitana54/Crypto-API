import mongoose from "mongoose";
import { ITransaction } from "../interfaces/transaction.interface";

export interface ITransactionModel extends Omit<ITransaction, 'id'>,
    mongoose.Document {
    _id: mongoose.Types.ObjectId;
}

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User',
        },
        assetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Asset',
        },
        type: {
            type: String,
            enum: ['BUY', 'SELL'],
            required: true,
        },
        quantity: { type: Number, required: true },
        priceUsdAtExecution: { type: Number, required: true },
        executedAt: { type: Date, required: true },
        notes: { type: String },

        priceSource: {
            type: String,
            enum: ['CoinCap', 'CACHE'],
            required: true
        },
    },
    {
        timestamps: true,
    }
);

export const TransactionModel = mongoose.model<ITransactionModel>(
    'Transaction',
    transactionSchema
);