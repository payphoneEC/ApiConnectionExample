export class AnnulWaitResponseModel{
    id: number;
    statusCode: number;
    status: string;
    clientTransactionId: string;
    sale: AnnuledSales;
}

export class AnnuledSales{
    id: number;
    statusCode: number;
    status: string;
    clientTransactionId: string;
}