export interface TransactionResponseDto {
    id: string;
    userId: string;
    assetId: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    priceUsdAtExecution: number;
    executedAt: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTransactionDto {
    userId: string;
    assetId: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    priceUsdAtExecution: number;
    executedAt: string;
    notes?: string;
}

export interface UpdateTransactionDto {
    type?: 'BUY' | 'SELL';
    quantity?: number;
    priceUsdAtExecution?: number;
    executedAt?: string;
    notes?: string;
}