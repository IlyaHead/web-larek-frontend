// Класс слоя отображения для работы с главной страницы и ее компонентами

import { ensureElement } from "../../utils/utils"; // Импортируем утилиту для работы с поиском элементов разметки
import { Component } from "../base/Component"; // Импортируем базовый класс для работы с компонентами
import { EventEmitter } from "../base/events"; // Импорт интерфейса для работа с событиями
import { IEvents_ENUM } from "../../utils/constants";

interface IPage {
  itemsContainer: HTMLElement[];
  basketButton: HTMLButtonElement;
  basketCount: number;
}

export class Page extends Component<IPage> {
  protected _itemsContainer: HTMLElement;
  protected _basketButton: HTMLButtonElement;
  protected _basketCount: HTMLElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);

    this._itemsContainer = ensureElement('.gallery', this.container); // Находим элемент в контейнере для вывода карточек товаров в галерее
    this._basketButton = ensureElement('.header__basket', this.container) as HTMLButtonElement; // Находим кнопку корзины в контейнере, которая будет открывать модальное окно с корзиной
    this._basketCount = ensureElement('.header__basket-counter', this.container); // Находим элемент счетчика в кнопке корзины, который будет отображать количество товаров в корзине

    this._basketButton.addEventListener('click', () => { // Добавляем обработчик события клика на кнопку корзины
      events.emit(IEvents_ENUM.BASKET_OPEN) // При клике на кнопку корзины, генерируем событие открытия корзины
    })
  } 

  set itemsContainer(items: HTMLElement[]) {
    this._itemsContainer.replaceChildren(...items); // Заменяем содержимое контейнера для карточек товара на новые элементы
  }

}
