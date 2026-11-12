// Define los Data Transfer Objects (DTOs) utilizados para la comunicación entre el servidor y los clientes.
// Los DTOs garantizan que solo se expongan datos relevantes y seguros, manteniendo un contrato claro
// para las peticiones y respuestas en toda la aplicación.
export interface AssetResponseDto {
    id: string;
    name: string;
    symbol: string;
    coincapId: string;
    lastPriceUsd?: number;
    lastPriceAt?: Date;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAssetDto {
    name: string;
    symbol: string;
    coincapId: string;
}

export interface UpdateAssetDto {
    name?: string;
    symbol?: string;
}