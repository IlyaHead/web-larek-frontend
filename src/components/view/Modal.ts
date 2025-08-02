import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component'; // Импортируем базовый класс для создания компонентов
import { EventEmitter } from '../base/events';
import { IEvents_ENUM } from '../../utils/constants';

interface IModal { // Интерфейс модального окна
  content: HTMLElement
}

export class Modal extends Component<IModal> {
  
  protected closeButton: HTMLButtonElement; // Кнопка закрытия модального окна
  protected _content: HTMLElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container); // Вызываем конструктор базового класса
    this._content = ensureElement<HTMLElement>('.modal__content', container); // Находим элемент разметки для контента модального окна')
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container); // Находим кнопку закрытия модального окна

    this.closeButton.addEventListener('click', () => {
      events.emit(IEvents_ENUM.MODAL_CLOSE); // Генерируем событие закрытия модального окна
    }); 
  }

  set content(template: HTMLTemplateElement){
    this._content.replaceChildren(cloneTemplate(template)); // Заменяем содержимое контента модального окна на новый темплейт
  }

  close() {
    this.container.classList.remove('modal_active'); // Убираем класс активности у модального окна
    this._content.replaceChildren(); // Очищаем содержимое модального окна
  }
  open(template: HTMLTemplateElement) {
    this._content.replaceChildren(template); // Заменяем содержимое контента модального окна на новый темплейт
    this.container.classList.add('modal_active'); // Добавляем класс активности к модальному окну
  }

}