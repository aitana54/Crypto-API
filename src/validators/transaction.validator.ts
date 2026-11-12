import Joi from "joi";

export class TransactionValidator {

    private static readonly objectId = Joi.string()
        .trim()
        .length(24)
        .hex();

    private static readonly quantity = Joi.number().positive();

    private static readonly executedAt = Joi.date().iso();

    private static readonly notes = Joi.string().trim().max(500);

    private static readonly type = Joi.string().valid('BUY', 'SELL');

    private static readonly skip = Joi.number().integer().min(0);

    private static readonly limit = Joi.number().integer().min(1).max(100);

    static readonly transactionIdSchema = Joi.object({
        id: TransactionValidator.objectId.required(),
    });

    static readonly paginationSchema = Joi.object({
        skip: TransactionValidator.skip,
        limit: TransactionValidator.limit,
    }).and('skip', 'limit');

    static readonly createSchema = Joi.object({
        assetId: TransactionValidator.objectId.required(),
        type: TransactionValidator.type.required(),
        quantity: TransactionValidator.quantity.required(),
        executedAt: TransactionValidator.executedAt.required(),
        notes: TransactionValidator.notes,
    });

    static readonly updateSchema = Joi.object({
        type: TransactionValidator.type,
        quantity: TransactionValidator.quantity,
        executedAt: TransactionValidator.executedAt,
        notes: TransactionValidator.notes,
    }).min(1);
}