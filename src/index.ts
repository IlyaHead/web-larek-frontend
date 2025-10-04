import 																						'./scss/styles.scss';
import { AppData, CatalogChangeEvent } from 			'./components/model/AppData';
import { EventEmitter } from 											'./components/base/events';
import { Page } from 															'./components/Page';
import { Card} from 															'./components/Card';
import { Basket } from 														'./components/Basket';
import { cloneTemplate, ensureElement } from 			'./utils/utils';
import { ICard, Tpayment, Errors, TOrder } from 	'./types';
import { Modal } from 														'./components/common/Modal';
import { API_URL, CDN_URL } from 									'./utils/constants';
import { LarekApi } from 													'./components/LarekApi';
import { ContactStep, PaymentStep } from 					'./components/OrderSteps';
import { OrderSuccess } from 											'./components/OrderSuccess';

// Точка входа:
const events = new EventEmitter();					// экз класса событий
const api = new LarekApi(CDN_URL, API_URL);	// экз класса коммуникации
const appData = new AppData({}, events);		// экз класса данных приложения


const page = new Page(ensureElement<HTMLElement>('.page'), events);								// экз класса страницы
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); 	// экз класса модального окна

let orderStep: 'delivery' | 'contacts' = 'delivery';															// Этапы оформления заказа

// Шаблоны разметки 
const templates = {
  card_catalog: 		ensureElement<HTMLTemplateElement>('#card-catalog'),					// шаблон товара в каталоге
  card_modal: 			ensureElement<HTMLTemplateElement>('#card-preview'), 					// шаблон товара в модальном окне
	card_basket: 			ensureElement<HTMLTemplateElement>('#card-basket'), 					// шаблон товара в корзине
	basket: 					ensureElement<HTMLTemplateElement>('#basket'), 								// шаблон корзины
	order_payment: 		ensureElement<HTMLTemplateElement>('#order'), 								// шаблон шага оформления заказа - Этап "Выбор оплаты / Ввод адреса"
	order_contacts: 	ensureElement<HTMLTemplateElement>('#contacts'), 							// шаблон шага оформления заказа - Этап "Ввод почтиы и телефона"
	order_success: 		ensureElement<HTMLTemplateElement>('#success'), 							// шаблон успешного оформления заказа
}

const basket = new Basket(cloneTemplate(templates.basket), events);									// экз класса корзины, слой отображения
const firstStep = new PaymentStep(cloneTemplate(templates.order_payment), events);	// экз класса шага оформления заказа - Этап "Выбор олптаы / Ввод адреса", слой отображения
const secondStep = new ContactStep(cloneTemplate(templates.order_contacts), events);// экз класса шага оформления заказа - Этап "Ввод почты и телефона", слой отображения
const orderSuccess = new OrderSuccess(cloneTemplate(templates.order_success), {			// экз класса ответа сервера, успех отправки заказа, слой отображения
	onClick: () => modal.close(),
});

// Поступление данных в приложения - отрисовка каталога
function renderCatalog(items: ICard[]){
  page.catalog = items.map(item => {
    const card  = new Card(cloneTemplate(templates.card_catalog),{
      onClick: () => events.emit('card:select', item),
    });
    return card.render(item);
  })
}

// Отрисовка корзины, обновление счетсика
function renderBasket(items: ICard[], total: number){
	page.basketCounter = items.length;
	const basketItems = items.map((item, index) => {
		const card = new Card(cloneTemplate(templates.card_basket), {
			onClick: () => events.emit('item:check', item),
		});
		card.index = index + 1;
		return card.render({ title: item.title, price: item.price });
	});
	return basket.render({
		items: basketItems,
		total,
		selected: items.map((p) => p.id),
	});
		}

// Работа с событиями
// Поступление данных в приложение - отрисовка каталога
events.on<CatalogChangeEvent>('items:updated', ({ items }) => {
	renderCatalog(items);
});

// Обработка клика на карточку товара - установка значения _preview
events.on<ICard>('card:select', (item) => {
	appData.preview = item;
})

// Обработка события изменения значения поля _preview - отрисовка модального окна
events.on<ICard>('preview:updated', (item) => {
	const card = new Card(cloneTemplate(templates.card_modal), {
		onClick: () => {
			events.emit('item:check', item);
			card.buttonText = appData._basket.items.includes(item)
				? 'Убрать из корзины'
				: 'В корзину';
		},
	});
	card.buttonText = appData._basket.items.includes(item)
		? 'Убрать из корзины'
		: 'В корзину';

	modal.render({ content: card.render(item) });
});

// Проверка наличия товара в корзине  - добавления или удаление
events.on<ICard>('item:check', (item) => {
	appData.checkItem(item);
});

// Обработка события изменения корзины - отрисовка модального окна с корзиной
events.on('basket:open', () => {
	const content = renderBasket(appData._basket.items, appData.getBasketTotal());
	modal.render({ content });
});

// Обработка события изменения корзины - отрисовка корзины на странице
events.on<{items: ICard[]; total: number}>('basket:updated',({ items, total }) => renderBasket(items, total));

// Обработка события клика на кнопку "Оформить заказ" - отрисовка модального окна с первым шагом оформления заказа
events.on('order:open', () => {
	orderStep = 'delivery';
	const { payment, address } = appData._order;
	const isAddressCorrect = Boolean(address);
	const content = firstStep.render({
		valid: isAddressCorrect,
		errors: '',
		payment,
		address,
	});
	modal.render({ content });
});

// Обработка событий изменения значений полей формы
events.on<{ field: keyof TOrder; value: string }>('formField:changed', ({field, value}) => {
	appData.setOrderField(field,value);
	if(field === 'payment'){
		firstStep.payment = value as Tpayment;
	}
	if (field === 'address') {
		firstStep.address = value; 	// тех: вызов сеттера address
	}
	if (field === 'email') {
		secondStep.email = value;		// тех: вызов сеттера address
	}
	if (field === 'phone') {
		secondStep.phone = value;		// тех: вызов сеттера address
	}
})

// Обработка события валидации формы
events.on<{errors: Errors<TOrder>; valid: boolean }>(
	'form:validated',
	({ errors, valid }) => {
		const message = Object.values(errors).join(', ');
		if (orderStep === 'delivery') {
			firstStep.valid = valid;
			firstStep.errors = message;
		} else {
			secondStep.valid = valid;
			secondStep.errors = message;
		}
	}
);

// Обработка события клика на кнопку "Продолжить" - переход ко второму шагу оформления заказа
events.on('order:submit', () => {
	orderStep = 'contacts';
	modal.render({
		content: secondStep.render({
			valid: false,
			errors: '',
			email: appData._order.email,
			phone: appData._order.phone,
		}),
	});
});

// Обработка события клика на кнопку "Оплатить" - отправка заказа на сервер
events.on('contacts:submit', () => {
	appData.submitOrder();
});

// Обработка события успешной отправки заказа на сервер
events.on<{ order: TOrder; total: number; items: string[];}>('order:confirmed', 
	({ order, total, items }) => {
	api
		.order({ ...order, total, items })
		.then(() => {
			modal.render({ content: orderSuccess.render({ total }) });
			appData.clearBasket();
			appData.clearForm()
		})
		.catch(console.error);
});

// Блокировка страницы при открытии модального окна
events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));

// Инициализация приложения - загрузка каталога
api
.getItems()
.then((items) => {
	appData.catalog = items;
})
.catch((err) => {
	return Promise.reject(err);
})



