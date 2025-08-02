// Класс для работы с отображением элементов карточки на главной странице, в каталоге

import { ICard } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events"; // Импорт интерфейса для работа с событиями

export class Card extends Component<ICard>{

  protected cardCategory:           HTMLElement;
  protected cardTitle:              HTMLElement;
  protected cardImage:              HTMLImageElement;
  protected cardPrice:              HTMLElement;

  protected _id:                    string;
  
  constructor(container: HTMLElement, protected events: IEvents, templateType: HTMLElement) {
    super(container);
    
    this.cardCategory             = ensureElement<HTMLElement>      ('.card__category', this.container);
    this.cardTitle                = ensureElement<HTMLElement>      ('.card__title',    this.container);
    this.cardImage                = ensureElement<HTMLImageElement> ('.card__image',    this.container);
    this.cardPrice                = ensureElement<HTMLElement>      ('.card__price',    this.container);
    
    //здесь добавить обработчики событий клика
  }

  set category(value: string) {
    this.setText(this.cardCategory, value);
  }

  set title(value: string) {
    this.setText(this.cardTitle, value);
  }

  set image(value: string) {
    this.cardImage.src = value;
    this.cardImage.alt = `Изображение товара: ${this.cardTitle.textContent}`;
  }

  set price(value: number | null) {
    if (value === null) {
      this.cardPrice.textContent = 'Бесценно';
    } else {
      this.cardPrice.textContent = String(value) + ' синапсов';
    }
  }

  set id(value: string) {
    this._id = value;
  }

  get id(): string {
    return this._id;
  }
  
}