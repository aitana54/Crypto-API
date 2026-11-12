import { Types } from "mongoose";


export interface ITransaction {
    id: string;
    userId: Types.ObjectId;
    assetId: Types.ObjectId;
    type: 'BUY' | 'SELL';
    quantity: number;
    priceUsdAtExecution: number;
    executedAt: Date;
    notes?: string;
    priceSource?: string;
    createdAt: Date;
    updatedAt: Date;
}

type SystemKeys = 'id' | 'createdAt' | 'updatedAt';

export type ITransactionCreate = Omit<ITransaction, SystemKeys>;

export type ITransactionUpdate = Partial<Omit<ITransaction, SystemKeys>>;