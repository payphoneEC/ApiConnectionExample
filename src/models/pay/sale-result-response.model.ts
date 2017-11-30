export class SaleResultResponseModel{
    email: string;
    cardType: string;
    clientUserId: string;
    processor: string;
    bin: string;
    deferredCode: string;
    deferredMessage: string;
    deferred: boolean;
    cardBrandCode: string;
    cardBrand: string;
    amount: number;
    clientTransactionId: string;
    phoneNumber: string;
    statusCode: number;
    transactionStatus: string;
    authorizationCode: string;
    message: string;
    messageCode: number;
    transactionId: number;
    document: string;
    taxes: TaxesModel[];
}

export class TaxesModel{
    name: string;
    amount: number;
    value: number;
    tax: number;
}