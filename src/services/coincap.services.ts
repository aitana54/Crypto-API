import axios from 'axios';
import { ICoincapAssetResponse } from '../interfaces/coincap.interface';
import { AssetRepository } from "../repositories/asset.repository";

export class CoincapService {

    private readonly assetRepository: AssetRepository;

    private readonly baseUrls = 'https://api.coincap.io/v2';

    constructor() {
        this.assetRepository = new AssetRepository();
    }



    async getPrice(coincapId: string): Promise<{ price: number, source: 'CoinCap' | 'CACHE' }> {
        try {
            const respone = await axios.get<ICoincapAssetResponse>(
                `${this.baseUrls}/assets/${coincapId}`
            );
            return {
                price: parseFloat(respone.data.data.priceUsd),
                source: 'CoinCap'
            };

        } catch (error) {
            console.log('Coincap error:', error);
            const asset = await this.assetRepository.getByCoincapId(coincapId);

            if (!asset || asset.lastPriceUsd === undefined || asset.lastPriceUsd === null) {
                throw new Error('No cached price available');
            }

            return {
                price: asset.lastPriceUsd,
                source: 'CACHE'
            }
        }
    }
}