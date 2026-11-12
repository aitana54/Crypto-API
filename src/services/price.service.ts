import axios from "axios";
import { ICoinGeckoResponse } from "../interfaces/coingecko.interface";
import { AssetRepository } from "../repositories/asset.repository";

export class PriceService {
    private readonly assetRepository: AssetRepository;

    private readonly baseUrls = 'https://api.coingecko.com/api/v3/simple/price';

    constructor() {
        this.assetRepository = new AssetRepository();
    }

    async getPrice(assetId: string): Promise<{ price: number, source: 'COINGECKO' | 'CACHE' }> {
        try {
            const response = await axios.get<ICoinGeckoResponse>(
                `${this.baseUrls}?ids=${assetId}&vs_currencies=usd`
            );

            return {
                price: response.data[assetId].usd,
                source: 'COINGECKO'
            };
        } catch (error) {
            const asset = await this.assetRepository.getByCoincapId(assetId);

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