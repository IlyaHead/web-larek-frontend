import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage {
  basketCounter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export class Page extends Component<IPage> implements IPage{
  protected _basketCounter: HTMLElement;
  protected _basketButton: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basketButton = ensureElement<HTMLElement>('.header__basket');

    this._basketButton.addEventListener('click', () => {
        this.events.emit('basket:open');
    })
  }

  set basketCounter (value: number) {
    this.setText(this._basketCounter, String(value));
  }

  set catalog(items: HTMLElement[]){
    this._catalog.replaceChildren(...items);
  }

  set locked(value: boolean) {
    this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
  }
}