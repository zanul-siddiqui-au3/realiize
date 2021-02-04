import { Component, AfterViewChecked, OnInit, DoCheck } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { PaymentService } from './../payment.service';
import Swal from 'sweetalert2';

declare let paypal: any;

@Component({
  selector: 'app-paypal-root',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements AfterViewChecked {

  constructor(
    private router: Router,
    private paymentService: PaymentService,
  ) { }

  public didPaypalScriptLoad = false;
  public loading = true;

  public paymentAmount = 20;
  public paypalConfig: any = {
    env: `${environment.paypalEnvironment}`,

    client: {
      sandbox: `${environment.paypalSandboxId}`,
      production: `${environment.paypalLiveId}`,
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.paymentAmount, currency: 'USD' } }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        this.paymentService.savePaypalPayment(payment)
          .subscribe(res => {
            Swal('Success!', 'Payment Successful.', 'success');
            this.router.navigate(['']);
          });
      });
    },
    onCancel: function (data, actions) {
      Swal('Error!', 'Payment Unsuccessful', 'error');
    },
    onError: function (err) {
      Swal('Error!', 'Payment Unsuccessful', 'error');
    }

  };

  public ngAfterViewChecked(): void {
    const elementExists: boolean = !!document.getElementById('paypal-button');
    if (elementExists && !this.didPaypalScriptLoad) {
      this.loadPaypalScript().then(() => {
        this.loading = false;
        paypal.Button.render(this.paypalConfig, '#paypal-button');
      });
    }
  }

  public loadPaypalScript(): Promise<any> {
    this.didPaypalScriptLoad = true;
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      document.body.appendChild(scriptElement);
      scriptElement.onload = resolve;
    });
  }
}
