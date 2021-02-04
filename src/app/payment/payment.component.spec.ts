import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { APP_BASE_HREF } from '@angular/common';

import { PaymentComponent } from './payment.component';
import { By, BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BaseRequestOptions, Http, XHRBackend } from '@angular/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Services
import { PaymentService } from './payment.service';
import { AuthUserService } from './../auth.user.service';
import { AuthService } from './../auth/auth.service';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        MockBackend,
        BaseRequestOptions,
        HttpClient,
        PaymentService,
        AuthUserService,
        AuthService
      ],
      declarations: [PaymentComponent],
      imports: [MaterialModule, FormsModule, RouterModule, BrowserModule, HttpClientModule,
        HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    component.isSavedCardAvailable = true;
    component.savedCards = [{ brand: 'visa', last4: '4242', exp_month: '3', exp_year: '20' }];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should see saved cards tab', () => {
    component.isLoggedIn = true;
    const savedElement = fixture.debugElement.query(By.css('mat-tab-label-0-0'));
    const name = savedElement.nativeElement;
    expect(name.innerText).toEqual('saved cards');
  });

});
