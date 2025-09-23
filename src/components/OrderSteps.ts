import { Form } from './common/Form';
import { TOrder, Tpayment } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class PaymentStep extends Form<TOrder> {
	protected cardButtonElement: HTMLButtonElement;
	protected cashButtonElement: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cardButtonElement = ensureElement<HTMLButtonElement>('button[name=card]', container);
		this.cashButtonElement = ensureElement<HTMLButtonElement>('button[name=cash]', container);

		this.cardButtonElement.addEventListener('click', () => {
			events.emit(`payment:change`, {
				field: 'payment',
				value: Tpayment.card,
			});
			console.log(`${container.name}.payment:change`);
		});
		this.cashButtonElement.addEventListener('click', () => {
			events.emit(`payment:change`, {
				field: 'payment',
				value: Tpayment.cash,
			});
			console.log(`${container.name}.payment:change`);
		});
	}

	set payment(value: Tpayment) {
		this.toggleClass(this.cardButtonElement, 'button_alt-active', value === Tpayment.card);
		this.toggleClass( this.cashButtonElement, 'button_alt-active', value === Tpayment.cash);
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}

export class ContactStep extends Form<TOrder> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}
}