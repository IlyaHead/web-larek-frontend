import { ICard } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

const categories: Record<string, string> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	'другое': 'other',
	'дополнительное': 'additional',
	'кнопка': 'button',
};

export class Card extends Component<ICard> {
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _buttonText?: HTMLElement;
    protected _price: HTMLElement;
    protected _index?: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._image = container.querySelector(`.card__image`);
        this._category = container.querySelector(`.card__category`);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._description = container.querySelector(`.card__text`);
        this._button = container.querySelector(`.card__button`);
        this._index = container.querySelector(`.basket__item-index`);
        this._price = ensureElement<HTMLElement>('.card__price', container);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string) {
		this.setText(this._description, value);
	}

    set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, `card__category_${categories[value]}`, true);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			if (this._button) this.setDisabled(this._button, true);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set buttonText(value: string) {
		this.setText(this._button, value);
	}
}