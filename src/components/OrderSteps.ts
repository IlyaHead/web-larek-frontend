import { Form } from './common/Form';
import { TOrder, Tpayment } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class PaymentStep extends Form<TOrder> {
	protected cardButtonElement: HTMLButtonElement;
	protected cashButtonElement: HTMLButtonElement;

	protected addressInputElement: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cardButtonElement = ensureElement<HTMLButtonElement>('button[name=card]', container);
		this.cashButtonElement = ensureElement<HTMLButtonElement>('button[name=cash]', container);

		this.addressInputElement = ensureElement<HTMLInputElement>('input[name=address]', container); // Находим поле адреса

		this.cardButtonElement.addEventListener('click', () => {
			events.emit('formField:changed', {
				field: 'payment',
				value: Tpayment.card,
			});
		});
		this.cashButtonElement.addEventListener('click', () => {
			events.emit('formField:changed', {
				field: 'payment',
				value: Tpayment.cash,
			});
		});
		this.addressInputElement.addEventListener('input', () => {
			events.emit('formField:changed', {
				field: 'address',
				value: this.addressInputElement.value,
			});
		});
	}

	set payment(value: Tpayment) {
		this.toggleClass(this.cardButtonElement, 'button_alt-active', value === Tpayment.card);
		this.toggleClass( this.cashButtonElement, 'button_alt-active', value === Tpayment.cash);
	}

	set address(value: string) {
		this.addressInputElement.value = value;
	}
}

export class ContactStep extends Form<TOrder> {
	protected emailInputElement: HTMLInputElement;
	protected phoneInputElement: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		
		this.emailInputElement = ensureElement<HTMLInputElement>('input[name=email]', container);
		this.phoneInputElement = ensureElement<HTMLInputElement>('input[name=phone]', container);

		// Обработчик для поля email
		this.emailInputElement.addEventListener('input', () => {
			events.emit('formField:changed', {
				field: 'email',
				value: this.emailInputElement.value,
			});
		});

		// Обработчик для поля phone
		this.phoneInputElement.addEventListener('input', () => {
			events.emit('formField:changed', {
				field: 'phone',
				value: this.phoneInputElement.value,
			});
		});
	}

	set email(value: string) {
		this.emailInputElement.value = value;
	}

	set phone(value: string) {
		this.phoneInputElement.value = value;
	}
}