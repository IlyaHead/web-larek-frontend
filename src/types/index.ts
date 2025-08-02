export type TCatalogCardView = Pick<ICard, 'category' | 'title' | 'image' | 'price'>; // Слой отображение: Компонент карточки товара в каталоге
export type TBasketCardView = Pick<ICard, 'title' | 'price'>; // Слой отображение: Компонент карточки товара в корзине
export type TModalCardView = Omit<ICard, 'id'>; // Слой отображение: Компонент карточки товара в модальном окне

export type TOrder_FirstStep = Pick<IOrderModel, 'payment' | 'address'>; // Слой отображение: Компонент первого шага заказа
export type TOrder_SecondStep = Pick<IOrderModel, 'email' | 'phone'>; // Слой отображение: Компонент второго шага заказа

export enum TPayment { CASH = 'cash', CARD = 'card'}; // Способы оплаты

export interface ICard { // Интерфейс карточки товара
  id: string;
  category: string;
  title: string;
  image: string;
  description: string;
  price: number | null;
}

export interface ICardModel { // Интерфейс модели данных каталога карточек товара
  items: ICard[];
  preview: string | null

  getItem(id: string): ICard | undefined;
  // checkValidation(data: Record<keyof >):boolean доработать 
}

export interface IBasketModel { // Интерфейс модели данных корзины
  items: ICard[];
  totalPrice: number;
}

export interface IOrderModel { // Интерфейс модели данных заказа
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
  items: ICard[];
  totalPrice: number;
}

export interface OrderResponse { // Ответ сервера на заказ
  id: string;
  totalPrice: number;
}