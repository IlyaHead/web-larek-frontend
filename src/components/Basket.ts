import { createElement, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface IBasketView {
  items: HTMLElement[];
	total: number;
  selected: string[];
}

export class Basket extends Component<IBasketView> implements IBasketView{
  protected _items: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this._items = ensureElement<HTMLElement>('.basket__list', container);
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');

    if(this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      })
    }

    this.items = [];
  }

  set items(items: HTMLElement[]){
    if(items.length) {
      this._items.replaceChildren(...items);
    } else {
      this._items.replaceChildren(createElement<HTMLParagraphElement>('p', {textContent: 'Корзина пуста',}));
    }
  }

  set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

  set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}