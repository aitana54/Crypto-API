import { Types } from "mongoose";
import { TransactionModel } from "../models/transaction.model";
import { AssetRepository } from "../repositories/asset.repository";
import { CoincapService } from "./coincap.services";

export class PortFolioService {

    private readonly assetRepository = new AssetRepository();
    private readonly coincapService = new CoincapService();

    getPortfolio = async (userId: string) => {
        const aggregation = await TransactionModel.aggregate([
            { $match: { userId: new Types.ObjectId(userId)}},
            {
                $group: {
                    _id: "$assetId",

                    buyQuantity: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "BUY"] }, "$quantity", 0]
                        }
                    },

                    sellQuantity: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "SELL"] }, "$quantity", 0]
                        }
                    }
                }
            }
        ]);

        const result = [];

        for (const item of aggregation) {
            const asset = await this.assetRepository.getById(item._id.toString());

            if (!asset) continue;
            const netQuantity = item.buyQuantity - item.sellQuantity;

            if (netQuantity <= 0) continue;

            let price;

            try {
                price = await this.coincapService.getPrice(asset.coincapId);
            } catch {
                price = asset.lastPriceUsd;
            }

            const currentValueUsd = netQuantity * price.price;

            result.push({
                assetId: asset.id,
                symbol: asset.symbol,
                name: asset.name,
                netQuantity,
                priceUsd: price,
                currentValueUsd
            });
        }
        return result; 
    };
}