import { Api, ApiListResponse } from './base/api';
import { ICard, IOrderModel, /*IOrderResult*/ } from '../types';

export interface ILarekAPI {
    getItems: () => Promise<ICard[]>;
    // orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export class WebApi extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItems(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    // orderLots(order: IOrder): Promise<IOrderResult> {
    //     return this.post('/order', order).then(
    //         (data: IOrderResult) => data
    //     );
    // }

}