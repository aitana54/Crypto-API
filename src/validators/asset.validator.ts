// Define los esquemas Joi para validar las peticiones relacionadas con assets.
// Garantiza que los datos entrantes cumplan con la estructura y las reglas requeridas.

import Joi from "joi";

export class AssetValidator {
    private static readonly id = Joi.string().trim();

    private static readonly symbol = Joi.string()
        .trim()
        .uppercase()
        .min(2)
        .max(10);

    private static readonly name = Joi.string()
        .trim()
        .min(2)
        .max(50);

    private static readonly coincapId = Joi.string()
        .trim()
        .lowercase()
        .min(2)
        .max(50);

    private static readonly skip = Joi.number().integer().min(0);
    private static readonly limit = Joi.number().integer().min(1).max(100);

    static readonly assetIdSchema = Joi.object({
        id: AssetValidator.id.required(),
    });

    static readonly assetPaginationSchema = Joi.object({
        skip: AssetValidator.skip,
        limit: AssetValidator.limit,
    }).and('skip', 'limit');

    static readonly assetCreateSchema = Joi.object({
        symbol: AssetValidator.symbol.required(),
        name: AssetValidator.name.required(),
        coincapId: AssetValidator.coincapId.required(),
    });
}