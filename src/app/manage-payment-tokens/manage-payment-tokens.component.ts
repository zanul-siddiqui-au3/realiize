import { PaymentService } from './../payment/payment.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-payment-tokens',
  templateUrl: './manage-payment-tokens.component.html',
  styleUrls: ['./manage-payment-tokens.component.css'],
})
export class ManagePaymentTokensComponent
  implements OnInit, AfterViewInit, OnDestroy {
  saveThisCard = false;
  isSavedCardAvailable = false;

  @ViewChild('cardInfo') cardInfo: ElementRef;

  card: any;
  elements: any;
  emailAddress: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  savedCardString: string;
  savedCards: any;
  savedCardArray: any;
  isLoggedIn: boolean;
  step = 0;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    // this.elements = this.paymentService.stripe.elements();
    // this.getSavedCardDetails();
  }

  ngAfterViewInit() {
    // const style = {
    //   base: {
    //     lineHeight: '24px',
    //     fontFamily: 'monospace',
    //     fontSmoothing: 'antialiased',
    //     fontSize: '19px',
    //     '::placeholder': {
    //       color: '#aab7c4',
    //     },
    //   },
    //   invalid: {
    //     color: '#fa755a',
    //     iconColor: '#fa755a',
    //   },
    // };
    // this.card = this.elements.create('card', { style });
    // this.card.mount(this.cardInfo.nativeElement);
    // this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    // this.card.removeEventListener('change', this.cardHandler);
    // this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.changeDetector.detectChanges();
  }

  // async deleteCard(cardIndex) {
  //   const chargeData = {
  //     source: this.savedCards[cardIndex].id,
  //   };
  //   this.paymentService.deleteCard(chargeData).subscribe((res) => {
  //     Swal('Success!', 'Card Deleted Successfully!', 'success');
  //     this.getSavedCardDetails();
  //   });
  // }

  setStep(index: number) {
    this.step = index;
  }

  async onSubmit(form: NgForm) {
    //   const { token, error } = await this.paymentService.stripe.createToken(
    //     this.card
    //   );
    //   if (error) {
    //     Swal('Error!', error, 'error');
    //   } else {
    //     const chargeData = {
    //       token: token,
    //     };
    //     this.paymentService.saveCard(chargeData).subscribe((cards) => {
    //       Swal('Success!', 'Card Saved Successfully!', 'success');
    //       this.getSavedCardDetails();
    //     });
    //   }
    // }
    // async getSavedCardDetails() {
    //   this.paymentService.retrieveSavedCard().subscribe((cards) => {
    //     if (cards && cards.length > 0) {
    //       this.step = 0;
    //       this.isSavedCardAvailable = true;
    //       this.savedCards = cards;
    //     } else {
    //       this.step = 1;
    //       this.isSavedCardAvailable = false;
    //     }
    //   });
  }
}
