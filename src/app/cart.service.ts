import { Injectable } from '@angular/core';

@Injectable()
export class CartService {
  constructor() {
    if (typeof (Storage) !== undefined) {
      Storage.prototype.setObject = function (key, value) {
        this.setItem(key, JSON.stringify(value));
        return true;
      };
      Storage.prototype.getObject = function (key) {
        const value = this.getItem(key);
        return value && JSON.parse(value);
      };
    }
  }

  // Set items to cart in localStorage

  setCart = (item) => {
    return localStorage.setObject('cart', item);
  }

  // Get items from cart in localStorage

  getCart = () => {
    return localStorage.getObject('cart');
  }

  // To Add Item in cart in localStorage

  addItem = (item) => {
    let cart = this.getCart();
    if (cart === null) {
      cart = [];
    }
    cart.push(item);
    return this.setCart(cart);
  }

  // To Remove Item from cart in localStorage

  removeItem = (itemIndex) => {
    const cart = this.getCart();
    const itemIndexInCart = this.findItemIndexInCart(cart, itemIndex);
    if (itemIndexInCart !== -1) {
      cart.splice(itemIndexInCart, 1);
      this.setCart(cart);
      return true;
    } else {
      return false;
    }
  }

  // To Empty cart in localStorage

  clear = () => {
    const cart = [];
    this.setCart(cart);
  }

  findItemIndexInCart = (cart, itemIndex) => {
    return cart.findIndex((item, idx) => idx === itemIndex);
  }

}
