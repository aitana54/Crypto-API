import { Types } from "mongoose";
import { httpStatus } from "../config/httpStatusCodes";
import logger from "../config/logger";
import { ITransaction, ITransactionCreate, ITransactionUpdate } from "../interfaces/transaction.interface";
import { AssetRepository } from "../repositories/asset.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { AppError } from "../utils/application.error";
import { CoincapService } from "./coincap.services";

export class TransactionService {
    private readonly transactionRepository: TransactionRepository;
    private readonly assetRepository: AssetRepository;
    private readonly coincapService: CoincapService;

    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.assetRepository = new AssetRepository();
        this.coincapService = new CoincapService();
    }

    getAll = async (
        userId: string,
        pagination: {
            skip: number; limit: number;
        }): Promise<ITransaction[]> => {
        logger.debug('Service: Fetching transaction');
        return this.transactionRepository.getAll({ userId }, pagination);
    };

    getById = async (userId: string, id: string): Promise<ITransaction> => {
        const transaction = await this.transactionRepository.getByIdWithAsset(id);

        if (!transaction) {
            throw new AppError('Transaction not found', httpStatus.NOT_FOUND);
        }

        if (transaction.userId.toString() !== userId) {
            throw new AppError('Forbidden', httpStatus.FORBIDDEN);
        }

        return transaction;
    };

    create = async (
        userId: string,
        data: ITransactionCreate): Promise<ITransaction> => {
        const asset = await this.assetRepository.getById(data.assetId.toString());

        if (!asset) {
            throw new AppError('Assey not found', httpStatus.NOT_FOUND);
        }

        const price = await this.coincapService.getPrice(asset.coincapId);

        const priceData = await this.coincapService.getPrice(asset.coincapId);

        data.priceUsdAtExecution = priceData.price;
        data.priceSource = priceData.source;

        data.priceUsdAtExecution = price.price;

        data.userId = new Types.ObjectId(userId);

        const transaction = await this.transactionRepository.create(data);

        if (!transaction) {
            throw new AppError('Transaction creation failed', httpStatus.INTERNAL_SERVER_ERROR);
        }

        return transaction;
    };

    update = async (
        userId: string,
        id: string,
        data: ITransactionUpdate
    ): Promise<ITransaction> => {

        const transaction = await this.transactionRepository.getById(id);

        if (!transaction) {
            throw new AppError('Transaction not found', httpStatus.NOT_FOUND);
        }

        if (transaction.userId.toString() !== userId) {
            throw new AppError('Forbidden', httpStatus.FORBIDDEN);
        }

        const updated = await this.transactionRepository.update(id, data);

        if (!updated) {
            throw new AppError('Transaction not found', httpStatus.NOT_FOUND);
        }

        return updated;
    };

    delete = async (userId: string, id: string): Promise<ITransaction> => {
        const transaction = await this.transactionRepository.getById(id);

        if (!transaction) {
            throw new AppError('Transaction not found', httpStatus.NOT_FOUND);
        }

        if (transaction.userId.toString() !== userId) {
            throw new AppError('Forbidden', httpStatus.FORBIDDEN);
        }

        const deleted = await this.transactionRepository.delete(id);

        if (!deleted) {
            throw new AppError('Transaction not found', httpStatus.NOT_FOUND);
        }

        return deleted;

    };
}