import { Router } from "express";
import { AssetController } from "../controllers/asset.controller";
import { validate, ValidationSource } from "../middlewares/validate.middleware";
import { AssetValidator } from "../validators/asset.validator";


const assetController = new AssetController();
export const assetRouter = Router();


assetRouter.get('/', assetController.getAll);

assetRouter.get(
    '/:id',
    validate(AssetValidator.assetIdSchema, ValidationSource.PARAMS),
    assetController.getById
);

assetRouter.post(
    '/',
    validate(AssetValidator.assetCreateSchema, ValidationSource.BODY),
    assetController.create
);

assetRouter.patch(
    '/:id/refresh-last-price',
    validate(AssetValidator.assetIdSchema, ValidationSource.PARAMS),
    assetController.refreshLastPrice
);