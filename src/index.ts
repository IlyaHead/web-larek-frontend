import './scss/styles.scss';
import { AppData, CatalogChangeEvent } from './components/model/AppData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { Card} from './components/Card';
import { Basket } from './components/Basket';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ICard, TOrderForm, Tpayment } from './types';
import { Modal } from './components/common/Modal';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { ContactStep, PaymentStep } from './components/OrderSteps';

// Старт приложения
const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);
const appData = new AppData({}, events);


const page = new Page(ensureElement<HTMLElement>('.page'), events);
const modal = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	events
);

let orderStep: 'delivery' | 'contacts' = 'delivery';

// Шаблоны
const templates = {
  card_catalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  card_modal: ensureElement<HTMLTemplateElement>('#card-preview'),
	card_basket: ensureElement<HTMLTemplateElement>('#card-basket'),
	basket: ensureElement<HTMLTemplateElement>('#basket'),
	order_payment: ensureElement<HTMLTemplateElement>('#order'),
	order_contacts: ensureElement<HTMLTemplateElement>('#contacts'),
}

const basket = new Basket(cloneTemplate(templates.basket), events);
const firstStep = new PaymentStep(cloneTemplate(templates.order_payment), events);
const secondStep = new ContactStep(cloneTemplate(templates.order_contacts), events);


// Функция отрисовки каталога
function renderCatalog(items: ICard[]){
  page.catalog = items.map(item => {
    const card  = new Card(cloneTemplate(templates.card_catalog),{
      onClick: () => events.emit('card:select', item),
    });
    return card.render(item);
  })
}

// Функция отрисовки корзины
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

// Подписка на события

// При загрузке данных каталога
events.on<CatalogChangeEvent>('items:updated', ({ items }) => {
	renderCatalog(items);
});

// При клике на карточку товара
events.on<ICard>('card:select', (item) => {
	appData.preview = item;
})

// При обновлении поля _preview выводи в модалку
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

events.on<ICard>('item:check', (item) => {
	appData.checkItem(item);
});

events.on('basket:open', () => {
	const content = renderBasket(appData._basket.items, appData.getBasketTotal());
	modal.render({ content });
});

events.on<{items: ICard[]; total: number}>('basket:updated',({ items, total }) => renderBasket(items, total));

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

events.on<{ field: keyof TOrderForm; value: string }>(
	'payment:change',
	({ field, value }) => {
		appData.setPayment(field, value);
		if (field === 'payment') {
			firstStep.payment = value as Tpayment;
		}
	}
);

events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));

api
.getItems()
.then((items) => {
	appData.catalog = items;
})
.catch((err) => {
	return Promise.reject(err);
})



