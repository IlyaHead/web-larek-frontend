// главный скрипт начала работы приложения

import './scss/styles.scss'; // Импортируем стили
import { WebApi } from './components/WebApi'; // Импортируем класс для работы с сервером
import { API_URL, CDN_URL, IEvents_ENUM } from './utils/constants'; // Импортируем константы для запросов на сервер
import { EventEmitter } from './components/base/events'; // Импортируем класс для работы с событиями

import { CardModel } from './components/model/CardModel'; // Импортируем модель для хранения данных карточек
import { cloneTemplate, ensureElement } from './utils/utils'; // Импорт используемых утилит
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page'; // Импортируем интерфейс для типизации параметров класса Page

// Создаем экземпляры классов WebApi и EventEmitter, для старта работы приложения
const api             = new WebApi(CDN_URL, API_URL);                                             // Экземпляр класса для работы с сервером, передаем в него URL для CDN и API
const events          = new EventEmitter();                                                       // Создаем экземпляр класса для работы с событиями передаем в него ранее созданный экземпляр класса для работы с событиями, чтобы модель могла оповещать об изменениях
const rootElement     = ensureElement<HTMLElement>('.page');                                      // Находим корневой элемент страницы, для поиска темплейтов

// Определяем набор теймплетов, которые будут использоваться в приложении
export const templates  = {
  galleryCardTemplate:  ensureElement<HTMLTemplateElement>('#card-catalog', rootElement),         // Темплейт для карточки товара в каталоге
  previewCardTemplate:  ensureElement<HTMLTemplateElement>('#card-preview', rootElement),         // Темплейт для карточки товара в модальном окне
  basketCardTemplate:   ensureElement<HTMLTemplateElement>('#card-basket',  rootElement),         // Темплейт для карточки товара в корзине
  basketTemplate:       ensureElement<HTMLTemplateElement>('#basket',       rootElement),         // Темплейт для корзины
  orderTemplate:        ensureElement<HTMLTemplateElement>('#order',        rootElement),         // Темплейт для заказа
  contactsTemplate:     ensureElement<HTMLTemplateElement>('#contacts',     rootElement),         // Темплейт для контактов
  successTemplate:      ensureElement<HTMLTemplateElement>('#success',      rootElement),         // Темплейт для успешного заказа
}
// DOM - элементы разметки
const contentElement  = ensureElement<HTMLElement>('.page__wrapper',        rootElement);         // Родительский контейнер для счетчика корзины, самой корзины, и галлереи карточек
const galleryElement  = ensureElement<HTMLElement>('.gallery',              contentElement);      // Находим элемент разметки для вывода данных из объекта cardModel, используя утилиту ensureElement

// DOM - слой отображения
const page            = new Page(contentElement,                            events);              // Экземпляр класса слоя отображения страницы, передаем в него элемент разметки, в который будем помещать контент страницы
const cardTemplate    = cloneTemplate<HTMLElement>(templates.galleryCardTemplate);                // Клонируем темплейт карточки для каталога
const modal           = new Modal(ensureElement<HTMLElement>('.modal',      rootElement), events);// Создаем экземпляр класса модального окна, передаем в него элемент разметки для модального окна 

// DOM - слой данных
const cardModel = new CardModel(events); // Создаем экземпляр класса для хранения данных карточек, 

api.getItems() // через объект класса работы с сервером делаем запрос
  .then(items => { // при удачно ответе сервера работаем с полученными данными через переменную items
    cardModel.items = items; // устанавливаем полученный ответ в ранее созданный объект модели данных при помощи метода setItems
  })
  .catch(error => { // в данном блоке обрабатывае ошибку, на случай если ответ сервера закончится провалом
    return Promise.reject('Ошибка: ' + error); // здесь вернется промис c детальным описанием полученный ошибки при запросе на сервер 
  })

  
// События
events.on(IEvents_ENUM.ITEMS_UPDATED, () => {
  const items = cardModel.items;
  items.forEach(item => { // перебираем массив items из объекта cardModel
  });
});

events.on(IEvents_ENUM.MODAL_CLOSE, () => { // подписка на событие закрытия модального окна
  modal.close(); // закрываем модальное окно
});

events.on(IEvents_ENUM.BASKET_OPEN, () => { // подписка на событие открытия корзины
  modal.open(cloneTemplate<HTMLTemplateElement>(templates.basketTemplate)); // открываем модальное окно с корзиной, клонируя темплейт корзины
});

events.on(IEvents_ENUM.DELIVERY_OPEN, () => {
  modal.close(); // закрываем модальное окно корзины
  modal.open(cloneTemplate<HTMLTemplateElement>(templates.orderTemplate)); // открываем модальное окно с заказом, клонируя темплейт заказа
})

