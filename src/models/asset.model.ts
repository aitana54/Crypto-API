import mongoose from "mongoose";
import { IAsset } from '../interfaces/asset.interface';


export interface IAssetModel extends Omit<IAsset, 'id'>, mongoose.Document {
    _id: mongoose.Types.ObjectId;
}


const assetSchema = new mongoose.Schema(
    {
        symbol: { type: String, require: true, trim: true, uppercase: true },
        name: { type: String, require: true, trim: true },
        coincapId: { type: String, require: true, unique: true, trim: true },
        lastPriceUsd: { type: Number },
        lastPriceAt: { type: Date },
    },
    {
        timestamps: true, // Agrega automaticamente createdAd y updatedAt
    }
);

export const AssetModel = mongoose.model<IAssetModel>('Asset', assetSchema);