import { IAppData, IBasket, ICard, TOrder, Tpayment } from "../../types";
import { Model } from "../base/Model";

export type CatalogChangeEvent = {
	items: ICard[];
};


export class AppData extends Model<IAppData>{
  _preview: ICard;
  _catalog: ICard[];
  _basket: IBasket = {
    items: [],
    total: 0
  };
  _order: TOrder = {
    payment: Tpayment.card,
    address: '',
    email: '',
    phone: ''
  }

  set preview(item: ICard){
    this._preview = item;
    this.events.emit('preview:updated', item);

  }

  getBasketItems(): ICard[]{
    return this._basket.items;
  }

  get preview(){
    return this._preview;
  }

  clearThePreview(){
    this._preview = null;
  }

  set catalog(items: ICard[]){
    this._catalog = items;
    this.events.emit('items:updated', { items: this._catalog})
  }

  get catalog(){
    return this._catalog;
  }

  checkItem(item: ICard) { // Проверка наличия товара в корзине, управляем текстом кнопки
		if (item.price === null) { // проверка на нулевой ценник
			console.warn('Только товары с установленной ценой могут быть добавлены в корзину');
			return;
		}
		const isItemInBasket = this._basket.items.some((i) => i.id === item.id);
		this._basket.items = isItemInBasket
			? this._basket.items.filter((i) => i.id !== item.id) // удалить товар из корзины
			: [...this._basket.items, item]; // добавить товар в корзину

		this.emitChanges('basket:updated', {
			items: this._basket.items,
			total: this.getBasketTotal(),
		});
	}

  setPayment<K extends keyof TOrder>(field: K, value: TOrder[K]) {
		this._order[field] = value;
		const step = field === 'payment' || field === 'address' ? 'delivery' : 'contacts';
		// this.fieldValidation(step, field);
	}

  // fieldValidation(step: 'delivery' | 'concatcs', field: keyof TOrder):boolean {
// доделать
  // }

  clearBasket(){
    this._basket.items = [];
		this.emitChanges('basket:updated', { items: [], total: 0 });
  }

  getBasketTotal(): number {
		return this._basket.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}
}