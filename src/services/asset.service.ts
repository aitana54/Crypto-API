import logger from "../config/logger";
import { IAsset, IAssetCreate } from "../interfaces/asset.interface";
import { AssetRepository } from "../repositories/asset.repository";
import { httpStatus } from "../config/httpStatusCodes";
import { AppError } from "../utils/application.error";
import { PriceService } from "./price.service";


export class AssetService {
    private readonly assetRepository: AssetRepository;
    private readonly priceService: PriceService;

    constructor() {
        this.assetRepository = new AssetRepository();
        this.priceService = new PriceService();
    }

    getAll = async (pagination: {
        skip: number;
        limit: number;
    }): Promise<IAsset[] | any> => {
        logger.debug('Service: Fetching all assets');

        const filters = {};
        return this.assetRepository.getAll(filters, pagination);
    };

    getById = async (id: string): Promise<IAsset | any> => {
        logger.debug(`Service: Fetching asset by ID: ${id}`);

        const asset = await this.assetRepository.getById(id);

        if (!asset) {
            logger.warn(`Asset with id ${id} not found`);
            throw new AppError('Asset not found', httpStatus.NOT_FOUND, { id });
        }

        return asset;

    }

    create = async (data: IAssetCreate): Promise<IAsset | any> => {
        logger.debug(`Service: Creating asset with symbol ${data.symbol}`);

        const existingAsset = await this.assetRepository.getByCoincapId(data.coincapId);

        if (existingAsset) {
            logger.warn(`Asset with coincapId ${data.coincapId} already exists`);
            throw new AppError('An asset with this coincapId already exists', httpStatus.CONFLICT, { coincapId: data.coincapId }
            );
        }

        const createdAsset = await this.assetRepository.create(data);

        if (!createdAsset) {
            logger.warn('Asset creation failed');
            throw new AppError('Asset creation failed', httpStatus.INTERNAL_SERVER_ERROR);
        }

        logger.info(`Asset ${data.symbol} created successfully`);
        return createdAsset;
    }

    refreshLastPrice = async (id: string): Promise<IAsset | any> => {
        logger.debug(`Service: Refreshing price for asset ${id}`);
        const asset = await this.assetRepository.getById(id);

        if (!asset) {
            logger.warn(`Asset with id ${id} not found`);
            throw new AppError('Asset not found', httpStatus.NOT_FOUND, { id });
        }

        const price = await this.priceService.getPrice(asset.coincapId);

        const updateAsset = await this.assetRepository.updateLastPrice(
            id,
            price.price,
        );

        if (!updateAsset) {
            logger.warn(`Asset ${id} price update failed`);
            throw new AppError(
                `Asset price update failed`,
                httpStatus.INTERNAL_SERVER_ERROR
            );
        }

        logger.info(`Asset ${asset.symbol} price updated successfully`);
        return updateAsset;
    }
}