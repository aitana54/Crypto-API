import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";
import { toCreateTransactionInput, toTransactionResponse, toUpdateTransactionInput } from "../mappers/transaction.mapper";
import { handleControllerError } from "../utils/logger.helper";
import { httpStatus } from "../config/httpStatusCodes";
import { AssetRepository } from "../repositories/asset.repository";
import { PriceService } from "../services/price.service";


export class TransactionController {
    private readonly transactionService: TransactionService;

    constructor(
        private readonly assetRepository: AssetRepository,
        private readonly priceService: PriceService) {
        this.transactionService = new TransactionService();
        
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;

            const { skip = 0, limit = 0 } = req.query;

            const pagination = {
                skip: parseInt(skip as string, 10),
                limit: parseInt(limit as string, 10),
            };

            const transaction = await this.transactionService.getAll(userId, pagination);

            const data = transaction.map(toTransactionResponse);

            res.send({
                message: 'Transactioin fetched successfully',
                length: data.length,
                data,
            });

        } catch (error) {
            next(handleControllerError(error, 'Error fetching transactions'));
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const transactionId = req.params.id;

            const transaction = await this.transactionService.getById(userId, transactionId);

            res.send({
                message: 'Transaction fetched successfully',
                data: toTransactionResponse(transaction),
            });

        } catch (error) {
            next(handleControllerError(error, 'Error fetching transaction'));
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;

            const asset = await this.assetRepository.getById(req.body.assetId);

            const { price } = await this.priceService.getPrice(asset.coincapId);

            const transactionData = {
                ...req.body,
                priceUsdAtExcution: price,
            };

            const transaction = await this.transactionService.create(userId,transactionData);

            res.status(httpStatus.CREATED).send({
                message: 'Transaction created successfully',
                data: toTransactionResponse(transaction),
            });
        } catch (error) {
            next(handleControllerError(error, 'Error creating transaction'));
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const input = toUpdateTransactionInput(req.body);

            const transaction = await this.transactionService.update(
                userId,
                req.params.id,
                input
            );

            res.send({
                message: 'Transaction updated successfully',
                data: toTransactionResponse(transaction),
            });

        } catch (error) {
            next(handleControllerError(error, 'Error updating transaction'));
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;

            const transaction = await this.transactionService.delete(userId, req.params.id);

            res.send({
                message: 'Transaction deleted successfully',
                data: toTransactionResponse(transaction),
            });

        } catch (error) {
            next(handleControllerError(error, 'Error deleting transaction'));
        }
    };
}