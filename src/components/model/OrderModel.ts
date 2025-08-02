import { ICard, TPayment, IOrderModel } from "../../types";

export class OrderModel implements IOrderModel{
  protected _payment: TPayment;
  protected _address: string;
  protected _email: string;
  protected _phone: string;
  protected _items: ICard[];
  protected _totalPrice: number | null;

  set payment(payment: TPayment) {
    this._payment = payment;
  }

  set address(address: string) {
    this._address = address;
  }

  set email(email: string) {
    this._email = email;
  }

  set phone(phone: string) {
    this._phone = phone;
  }

  set items(items: ICard[]) {
    this._items = items;
  }

  set totalPrice(items: ICard[]) {
    // this._totalPrice = this.calculateTotalPrice()
  }

  get totalPrice(): number | null {
    return this._totalPrice;
  }

  protected calculateTotalPrice(): void {
    if (this._items && this._items.length > 0) {
      this._totalPrice = this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    } else {
      this._totalPrice = null;
    }
  }
}