import { TestBed, inject } from '@angular/core/testing';

import { CartService } from './cart.service';

describe('CartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService]
    });
  });

  it('should be created', inject([CartService], (service: CartService) => {
    expect(service).toBeTruthy();
  }));

  it('should add item to cart in LocalStorage', inject([CartService], (service: CartService) => {
    const result = service.addItem({id: 1, name: 'myItem', price: '5$'});
    expect(result).toBeTruthy();
  }));

  it('should delete item from cart in LocalStorage', inject([CartService], (service: CartService) => {
    const result = service.removeItem(0);
    expect(result).toBeTruthy();
  }));
});
