import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

// import * as Stripe from 'stripe';

@Injectable()
export class PaymentService {
  BASE_URL = `/api/payment`;
  stripe = Stripe(environment.stripePublishableKey);

  constructor(private http: HttpClient) { }
  getPayments = () => {
    const PATH = `${this.BASE_URL}`;
    return this.http.get(PATH).pipe(map((res: any) => res));
  }

  getPaymentsById = (id)=>{
    const PATH = `${this.BASE_URL}/getPaymentDetails/${id}`;
    return this.http.get(PATH).pipe(map((res: any) => res));
  }

  createCharge = (chargeData) => {
    const PATH = `${this.BASE_URL}/charge/create`;
    return this.http.post(PATH, { chargeData }).pipe(map((res: any) => res));
  };

  createSavedCharge = (chargeData) => {
    const PATH = `${this.BASE_URL}/charge/savedCard`;
    return this.http.post(PATH, { chargeData }).pipe(map((res: any) => res));
  };

  chargeGuestCard = (chargeData) => {
    const PATH = `${this.BASE_URL}/charge/guestCard`;
    return this.http.post(PATH, { chargeData }).pipe(map((res: any) => res));
  };

  retrieveSavedCard = () => {
    const PATH = `${this.BASE_URL}/getSavedCard`;
    return this.http.get(PATH).pipe(map((res: any) => res));
  };

  savePaypalPayment = (paypalResponse) => {
    const PATH = `${this.BASE_URL}/savePayPalPayment`;
    return this.http
      .post(PATH, { paypalResponse })
      .pipe(map((res: any) => res));
  };

  saveCard = (chargeData) => {
    const PATH = `${this.BASE_URL}/saveCard`;
    return this.http.post(PATH, { chargeData }).pipe(map((res: any) => res));
  };

  getUserCardDetails = (userId)=>{
    const PATH = `${this.BASE_URL}/getUserCardDetails/${userId}`;
    return this.http
      .get(PATH)
      .pipe(map((res: any) => res));
  }

  deleteCard = (chargeData) => {
    const PATH = `${this.BASE_URL}/deleteCard`;
    return this.http.post(PATH, { chargeData }).pipe(map((res: any) => res));
  };

  createSubscriptionCharge = (chargeData) => {
    const PATH = `${this.BASE_URL}/subscription/create`;
    return this.http.post(PATH, { chargeData })
   
  }

  cancelSubscriptionRenewal = (subId?: string) => {
    const PATH = `${this.BASE_URL}/subscription/cancelRenewal`;
    return this.http.put(PATH, { subId }) 
  }

  changeSavedCard = (cardDetails)=>{
    const PATH = `${this.BASE_URL}/change/savedcard`;
    return this.http.post(PATH, cardDetails)
   
  }

}
