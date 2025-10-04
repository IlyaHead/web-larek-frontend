import { IAppData, IBasket, ICard, TOrder, Tpayment, Errors } from "../../types";
import { Model } from "../base/Model";

export type CatalogChangeEvent = {
	items: ICard[];
};

// Регулярки для проверки почты и номера телефона
const ValidationTests = {
  EMAIL: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, 
  PHONE: /^\+?\d{7,15}$/,
}

export type OrderSubmitEvent = {
	order: TOrder;
	total: number;
	items: string[];
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
  };

  Errors: Errors<TOrder> = {};

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

  setOrderField<K extends keyof TOrder>(field: K, value: TOrder[K]) {
		this._order[field] = value;
		const step =
			field === 'payment' || field === 'address' ? 'delivery' : 'contacts';
		this.validation(step, field);
	}

  validation(step: 'delivery' | 'contacts', changedField?: keyof TOrder): boolean {
	
		const errors: Errors<TOrder> = {};

		if (step === 'delivery') {
			if (!this._order.address) {
				errors.address = 'Необходимо указать адрес';
			}
		} else {
			// Проверяем email
			const email = this._order.email;
			if (changedField === 'email' || changedField === undefined) {
				if (!email) {
					errors.email = 'Необходимо указать email';
				} else if (!ValidationTests.EMAIL.test(email)) {
					errors.email = 'Неверный формат email';
				}
			}
			// Проверяем телефон
			const phone = this._order.phone;
			if (changedField === 'phone' || changedField === undefined) {
				if (!phone) {
					errors.phone = 'Необходимо указать телефон';
				} else if (!ValidationTests.PHONE.test(phone)) {
					errors.phone = 'Неверный формат телефона';
				}
			}
		}

		this.Errors = errors;

		// Определяем валидность формы
		let valid: boolean;
		if (step === 'delivery') {
			valid = !!this._order.address;
		} else {
			const emailCheck = ValidationTests.EMAIL.test(this._order.email);
			const numberCheck = ValidationTests.PHONE.test(this._order.phone);
			valid = emailCheck && numberCheck;
		}

		this.emitChanges('form:validated', { errors, valid });
		return valid;
	}

  submitOrder() {
		const okDelivery = this.validation('delivery');
		const okContacts = this.validation('contacts');
		if (!okDelivery || !okContacts) return;

		const payload: OrderSubmitEvent = {
			order: this._order,
			total: this.getBasketTotal(),
			items: this._basket.items.map((p) => p.id),
		};
		this.emitChanges('order:confirmed', payload);
	}

  clearBasket(){
    this._basket.items = [];
		this.emitChanges('basket:updated', { items: [], total: 0 });
  }

  getBasketTotal(): number {
		return this._basket.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}

	clearForm(){
		this._order = {
			payment: Tpayment.card,
			address: '',
			email: '',
			phone: ''
		};
	}
}