import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeSubscriptionComponent } from './stripe-subscription.component';

describe('StripeSubscriptionComponent', () => {
  let component: StripeSubscriptionComponent;
  let fixture: ComponentFixture<StripeSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
