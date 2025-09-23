export interface ICard {
  id: string;
  category: string;
  title: string;
  image: string;
  description: string;
  price: number | null;
}

export interface IBasket {
  items: ICard[];
  total: number;
}

export enum Tpayment {
  cash = 'cash',
  card = 'card',
};

export interface IOrder {
  payment: Tpayment;
  address: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
}

export type TOrder = Omit<IOrder, 'items'|'total'>;
export type TOrderForm = Pick<IOrder, 'payment'|'address'>;
export type TContactsForm = Pick<IOrder, 'email'|'phone'>;

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IAppData {
  preview: ICard;
  catalog: ICard[];
  basket: IBasket;
}