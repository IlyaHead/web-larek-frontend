import { ICard, IOrder, IOrderResult } from "../types"
import { Api, ApiListResponse } from "./base/api";

export interface ILarekApi {
  getItems:() => Promise<ICard[]>;
  getItem:(id: string) => Promise<ICard>;
  order: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getItems(): Promise<ICard[]> {
    return this.get('/product').then((data: ApiListResponse<ICard>) => 
      data.items.map((item) => ( {
        ...item,
        image: this.cdn + item.image.replace(".svg", ".png")
      })));
  }

  getItem(id: string): Promise<ICard> {
    return this.get(`/product/${id}`).then((item: ICard) => ({
      ...item,
      image: this.cdn + item.image,
    }));
  }

  order(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then((data: IOrderResult) => data);
  }
}