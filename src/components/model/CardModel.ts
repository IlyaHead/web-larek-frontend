import { ICard, ICardModel } from "../../types";
import { IEvents_ENUM } from "../../utils/constants";
import { IEvents } from "../base/events";

export class CardModel implements ICardModel {
  protected _items: ICard[];
  protected _preview: ICard;

  constructor(protected events: IEvents) {
    this._items = [];
  }

  set items(data: ICard[]){
    this._items = data;
    this.events.emit(IEvents_ENUM.ITEMS_UPDATED)
  }

  get items(): ICard[] {
    return this._items;
  }

  getItem(id: string): ICard | undefined {
    return this._items.find(item => item.id === id);
  }

  set preview(id: string) {
    this._preview = this.getItem(id);
    this.events.emit(IEvents_ENUM.PREVIEW_UPDATED)
  }


}