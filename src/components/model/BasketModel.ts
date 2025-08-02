import { ICard, IBasketModel } from "../../types";
import { IEvents } from "../base/events";

export class BasketModel implements IBasketModel {
  protected _items: ICard[];
  protected _totalPrice: number = 0;

  constructor(protected events: IEvents) {
    this._items = [];
  }

  set items(data: ICard[]) {
    this._items = data;
  }

  get items(): ICard[] {
    return this._items;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  addToBasket(item: ICard):void {
    this.items.push(item);
    this._totalPrice += item.price || 0; // Предполагается, что цена может быть null
  }

  removeFromBasket(itemId: string):void {
    const itemIndex = this.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      this._totalPrice -= this.items[itemIndex].price || 0; // Уменьшаем общую цену
      this.items.splice(itemIndex, 1); // Удаляем товар из корзины
    }
  }

  clearBasket():void {
    this._items = [];
  }

}