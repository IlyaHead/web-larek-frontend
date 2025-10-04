import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface IOrderSuccess {
	total: number;
}

interface IOrderSuccessActions {
	onClick: () => void;
}

export class OrderSuccess extends Component<IOrderSuccess> {
	protected _description: HTMLElement;
	protected _close: HTMLElement;

	constructor(container: HTMLElement, actions: IOrderSuccessActions) {
		super(container);

		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}