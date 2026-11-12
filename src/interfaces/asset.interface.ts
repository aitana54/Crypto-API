export interface IAsset {
    id: string;
    symbol: string;
    name: string;
    coincapId: string;
    lastPriceUsd?: number;
    lastPriceAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

type SystemKeys = 'id' | 'createdAt' | 'updatedAt';

export type IAssetCreate = Omit<IAsset, SystemKeys>;

export type IAssetUpdate = Partial<Omit<IAsset, SystemKeys>>;