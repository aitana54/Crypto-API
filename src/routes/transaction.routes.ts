import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { validate, ValidationSource } from "../middlewares/validate.middleware";
import { TransactionValidator } from "../validators/transaction.validator";
import { checkToken } from "../middlewares/auth.middleware";
import { AssetRepository } from "../repositories/asset.repository";
import { PriceService } from "../services/price.service";

const assetRepository = new AssetRepository();
const priceService = new PriceService();

const transactionController = new TransactionController(
  assetRepository,
  priceService
);
export const transactionRouter = Router();

transactionRouter.get(
    '/',
    checkToken,
    validate(TransactionValidator.paginationSchema, ValidationSource.QUERY),
    transactionController.getAll
);

transactionRouter.get(
    '/:id',
    checkToken,
    validate(TransactionValidator.transactionIdSchema, ValidationSource.PARAMS),
    transactionController.getById
);

transactionRouter.post(
    '/',
    checkToken,
    validate(TransactionValidator.createSchema, ValidationSource.BODY),
    transactionController.create
);

transactionRouter.patch(
    '/:id',
    checkToken,
    validate(TransactionValidator.transactionIdSchema, ValidationSource.PARAMS),
    validate(TransactionValidator.updateSchema, ValidationSource.BODY),
    transactionController.update
);

transactionRouter.delete(
    '/:id',
    checkToken,
    validate(TransactionValidator.transactionIdSchema, ValidationSource.PARAMS),
    transactionController.delete
);