import { type CreateAssetDto, type UpdateAssetDto, type AssetResponseDto } from "../dtos/asset.dto";
import { IAsset, IAssetCreate, IAssetUpdate } from "../interfaces/asset.interface";

export const toCreateAssetInput = (dto: CreateAssetDto): IAssetCreate => ({
    name: dto.name,
    symbol: dto.symbol,
    coincapId: dto.coincapId,

});

export const toUpdateAssetInput = (dto: UpdateAssetDto): IAssetUpdate => {
  const input: IAssetUpdate = {};

  if (dto.name !== undefined) input.name = dto.name;
  if (dto.symbol !== undefined) input.symbol = dto.symbol;

  return input;
};

export const toAssetResponse = (a: IAsset): AssetResponseDto => {
    return {
        id: a.id,
        name: a.name,
        symbol: a.symbol,
        coincapId: a.coincapId,
        lastPriceUsd: a.lastPriceUsd,
        lastPriceAt: a.lastPriceAt,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
    };
};