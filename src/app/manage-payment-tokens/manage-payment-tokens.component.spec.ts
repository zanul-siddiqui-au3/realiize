import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePaymentTokensComponent } from './manage-payment-tokens.component';

describe('ManagePaymentTokensComponent', () => {
  let component: ManagePaymentTokensComponent;
  let fixture: ComponentFixture<ManagePaymentTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePaymentTokensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaymentTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
