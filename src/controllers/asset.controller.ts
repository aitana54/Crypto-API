import { type NextFunction, type Request, type Response } from "express";
import { httpStatus } from "../config/httpStatusCodes";
import logger from "../config/logger";
import { AssetService } from "../services/asset.service";
import { handleControllerError } from "../utils/logger.helper";
import { toAssetResponse, toCreateAssetInput } from "../mappers/asset.mapper";


export class AssetController {
    private readonly assetService: AssetService;

    constructor() {
        this.assetService = new AssetService();
    }

    getAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        logger.debug(
            `Controller: Received getAll request with query: ${JSON.stringify(
                req.query
            )}`
        );
        try {
            const { skip = 0, limit = 0 } = req.query;
            const pagination = {
                skip: parseInt(skip as string, 10),
                limit: parseInt(limit as string, 10),
            };
            const assets = await this.assetService.getAll(pagination);
            const data = assets.map(toAssetResponse);

            const response = {
                message: 'Assets fetched successfully',
                length: data.length,
                data,
            };
            logger.info('Controller: Assets fetched successfully');
            res.send(response);
        } catch (error) {
            next(handleControllerError(error, 'Error fetching assets'));
        }
    };

    getById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const assetId = req.params.id;

        logger.debug(
            `Controller: Received getById request for asset id: ${assetId}`
        );

        try {
            const asset = await this.assetService.getById(assetId);
            const data = toAssetResponse(asset);

            const response = {
                message: 'Asset fetched successfully',
                data,
            };

            logger.info(`Controller: Asset id: ${assetId} fetched successfully`);
            res.send(response);
        } catch (error) {
            next(handleControllerError(error, 'Error fetching asset by id'))
        }
    };

    create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const body = req.body;

        logger.debug({
            body
        },'Controller: Received request to create a new asset');

        try {
            const assetToCreate = toCreateAssetInput(body);

            const asset = await this.assetService.create(assetToCreate);
            const data = toAssetResponse(asset);

            const response = {
                message: 'Asset created successfully',
                data,
            };

            logger.info('Controller: Asset created successfully');
            res.status(httpStatus.CREATED).send(response);
        } catch (error) {
            next(handleControllerError(error, 'Error creating asset'));
        }
    };

    refreshLastPrice = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const assetId = req.params.id;

        logger.debug(
            `Controller: Received request to refresh price for asset id: ${assetId}`
        );

        try {
            const asset = await this.assetService.refreshLastPrice(assetId);
            const data = toAssetResponse(asset);

            const response = {
                message: 'Asset price refreshed successfully',
                data,
            };

            logger.info(
                `Controller: Asset id: ${assetId} price refreshed successfully`
            );

            res.send(response);
        } catch (error) {
            next(handleControllerError(error, 'Error refreshing asset price'));
        }
    };
}