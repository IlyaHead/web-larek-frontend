export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {};

export enum IEvents_ENUM {
  ITEMS_UPDATED           = 'ITEMS_UPDATED',
  MODAL_CLOSE             = 'MODAL_CLOSE',
  BASKET_OPEN             = 'BASKET_OPEN',
  ITEM_REMOVED            = 'ITEM_REMOVED',
  ITEM_ADDED              = 'ITEM_ADDED',
  BASKET_CLEARED          = 'BASKET_CLEARED',
  DELIVERY_OPEN           = 'DELIVERY_OPEN',
  PREVIEW_UPDATED         = 'PREVIEW_UPDATED',
  ADDRESS_FORM_OPEN       = 'ORDER_ADDRESS_OPEN',
  CONTACTS_FORM_OPEN      = 'ORDER_CONTACTS_OPEN',
  ORDER_RESULT_OPEN       = 'ORDER_FINISH_OPEN' 
  }