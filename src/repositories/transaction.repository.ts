import { ITransaction } from "../interfaces/transaction.interface";
import { ITransactionModel, TransactionModel } from "../models/transaction.model";
import { BaseRepository } from "./base.repository";

export class TransactionRepository extends BaseRepository<ITransaction, ITransactionModel> {
    constructor() {
        super(TransactionModel, 'transaction');
    }

    async getByIdWithAsset(id: string) {
        const doc = await this.model.findById(id).populate('assetId');

        if (!doc) return null;
        
        return this.transformId(doc);
    }
}