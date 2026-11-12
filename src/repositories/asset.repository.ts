import logger from "../config/logger";
import { IAsset } from "../interfaces/asset.interface";
import { AssetModel, IAssetModel } from "../models/asset.model";
import { BaseRepository } from './base.repository';

export class AssetRepository extends BaseRepository<IAsset, IAssetModel> {
    constructor() {
        super(AssetModel, 'asset');
    }

    async getByCoincapId(coincapId: string): Promise<IAsset | any> {
        logger.debug(`Respository: Fetching asset by coincapId: ${coincapId}`);

        const asset = await this.model.findOne({ coincapId });

        if(!asset) {
            logger.debug(`Repository: No asset found with coincapId: ${coincapId}`);
            return null;
        }

        logger.debug(`Repository: Asset with coincapId ${coincapId} fetched`);
        return this.transformId(asset);
    }

    async updateLastPrice(id: string, price: number): Promise<IAsset | any> {
        const asset = await this.model.findByIdAndUpdate(
            id,
            {
                lastPriceUsd: price, 
                lastPriceAt: new Date(),
            },
            { new: true }
        );

        if (!asset) {
            logger.debug(`Repository: Asset ${id} not found for price update`);
            return null;
        }

        logger.debug(`Repository: Asset ${id} price updated`);
        return this.transformId(asset);
    }
}