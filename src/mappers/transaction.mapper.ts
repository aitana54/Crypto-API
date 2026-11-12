import { Types } from "mongoose";
import { CreateTransactionDto, TransactionResponseDto, UpdateTransactionDto } from "../dtos/transaction.dto";
import { ITransaction, ITransactionCreate, ITransactionUpdate } from "../interfaces/transaction.interface";

export const toTransactionResponse = (
    t: ITransaction & { id: string }
): TransactionResponseDto => ({
    id: t.id,
    userId: t.userId.toString(),
    assetId: typeof t.assetId === 'object' && '_id' in t.assetId
        ? t.assetId._id.toString()
        : t.assetId.toString(),
    type: t.type,
    quantity: t.quantity,
    priceUsdAtExecution: t.priceUsdAtExecution,
    executedAt: t.executedAt.toISOString(),
    notes: t.notes,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
});


export const toCreateTransactionInput = (
    dto: CreateTransactionDto
): ITransactionCreate => ({
    userId: new Types.ObjectId(dto.userId),
    assetId: new Types.ObjectId(dto.assetId),
    type: dto.type,
    quantity: dto.quantity,
    priceUsdAtExecution: dto.priceUsdAtExecution,
    executedAt: new Date(dto.executedAt),
    notes: dto.notes,
});

export const toUpdateTransactionInput = (
    dto: UpdateTransactionDto
): ITransactionUpdate | any => {
    const input: ITransactionUpdate = {};
    if (dto.executedAt !== undefined) new Date(dto.executedAt);
    if (dto.notes !== undefined) input.notes = dto.notes;

    return input;
};