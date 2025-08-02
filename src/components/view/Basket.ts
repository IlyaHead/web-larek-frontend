import { Component } from '../base/Component'; // Импортируем базовый класс для создания компонентов';
import { cloneTemplate, ensureElement } from '../../utils/utils'; // Импортируем утилиты для работы с DOM
import { EventEmitter} from '../base/events' 
import { IEvents_ENUM } from '../../utils/constants';

interface IBasket {
  cardsContainer: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {

  protected basketTemplate: HTMLTemplateElement;
  protected basketContentElement: HTMLElement;
  protected basketOrderButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container); // Вызываем конструктор базового класса
    this.basketTemplate = container as HTMLTemplateElement; // устанавливаем элемент разметки корзины, полученный в конструкторе
    this.basketContentElement = ensureElement('.basket__content', this.basketTemplate) as HTMLElement; // Находим элемент разметки для контента корзины
    this.basketOrderButton = ensureElement<HTMLButtonElement>('.basket__button', this.basketContentElement) // Находим элемент разметки кнопку

    this.basketOrderButton.addEventListener('click', () => {
      events.emit(IEvents_ENUM.DELIVERY_OPEN);
    })
  }


}