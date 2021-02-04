import { RouterModule } from '@angular/router';
import {
  Component,
  AfterViewInit,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef, Output, EventEmitter
} from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

import { PaymentService } from './payment.service';
import { AuthUserService } from './../auth.user.service';
import { Router } from '@angular/router';
import { APP_CONST } from '../../../shared/constants/constants';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements AfterViewInit, OnInit, OnDestroy {
  saveThisCard = false;
  isSavedCardAvailable = false;

  @ViewChild('cardInfo') cardInfo: ElementRef;
  @Input() isCardEdit : Boolean;

  card: any;
  emailAddress: any;
  elements: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  savedCardString: string;
  savedCards: any;
  savedCardArray: any;
  isLoggedIn: boolean;
  step = 0;
  @Output() isLoading = new EventEmitter();
  @Output() successSub = new EventEmitter();
  @Output() successReplace = new EventEmitter(); 
  @Output() cancelCardReplace = new EventEmitter();
  constructor(
    private cd: ChangeDetectorRef,
    private paymentService: PaymentService,
    private userService: AuthUserService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.elements = this.paymentService.stripe.elements();
  }

  ngAfterViewInit() {
    const style = {
      base: {
        lineHeight: '24px',
        fontFamily: 'monospace',
        fontSmoothing: 'antialiased',
        fontSize: '19px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    this.card = this.elements.create('card', { style });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  setStep(index: number) {
    this.step = index;
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit() {
    const { token, error } = await this.paymentService.stripe.createToken(
      this.card
    );
    if (error) {
      Swal('Error!', error.message, 'error');
    } else {
      if (this.isLoggedIn) {
        this.isLoading.emit(true);
        const chargeData = {
          token: token,
          amount: APP_CONST.PRICES.SUB_AMOUNT,
          currency: 'usd'
        };
        this.paymentService.createCharge(chargeData).subscribe(
          (res) => {
            this.isLoading.emit(false);
            this.showMessageToUser(res);
          },
          (err) => {
            this.stripePaymentError(err);
          }
        );
      } else {
        const chargeData = {
          currency: 'usd',
          amount: APP_CONST.PRICES.SUB_AMOUNT,
          token: token,
          email: this.emailAddress,
        };
        this.paymentService.createSubscriptionCharge(chargeData).subscribe(
          (res) => {
            this.isLoading.emit(false);
            this.successSub.emit(res);
          },
          (err) => {
            this.stripePaymentError(err);
          }
        );
      }
    }
  }

  async showMessageToUser(res) {
    if (res.status === 'active') {

      this.router.navigate(['']);
    } else {
      Swal('Error!', res.failureMessage, 'error');
      this.router.navigate(['']);
    }
  }

  async stripePaymentError({ error }) {
    Swal('Error!', error.message, 'error');
  }

  handleReplaceCard = async ()=>{
    this.isLoading.emit(true);
    const { token, error } = await this.paymentService.stripe.createToken(
      this.card
    );
    if (error) {
      Swal('Error!', error.message, 'error');
    } else {
      const {stripeCustomerId , _id} = this.userService.getUser();
      this.paymentService.changeSavedCard({card_token : token.id , customer_id : stripeCustomerId , _id}).subscribe(
          (res) => {
            this.isLoading.emit(false);
          this.successReplace.emit(res);
         },
          (err) => {
          this.stripePaymentError(err);
          }
      );
    }
  }

  handleCancelCard = ()=>{
    this.cancelCardReplace.emit();
  }
}
