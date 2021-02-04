import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import swal from "sweetalert2/dist/sweetalert2.js";
import { Router } from "@angular/router";
import { AuthUserService } from '../auth.user.service';
import { UserService } from '../auth/user-service.service';
import { BPAuthService } from '../auth/bp-auth.service';
import { SocialAuthService } from 'angularx-social-login';
import { PaymentService } from '../payment/payment.service';
import * as moment from "moment";

@Component({
  selector: 'app-stripe-subscription',
  templateUrl: './stripe-subscription.component.html',
  styleUrls: ['./stripe-subscription.component.scss']
})
export class StripeSubscriptionComponent implements OnInit {

  userData;
  dataSource = [];
  activeTab = 'payment';
  subscriptionStart;
  subscriptionEnd;
  isMobileView = false;
  isCardReplace : Boolean = false;
  userCardDetail;
  displayedColumns: string[] = ['date', 'amount'];
  isLoading = false;

  constructor(
    private userService: UserService,
    private authUserService: AuthUserService,
    private router: Router,
    private authService: SocialAuthService,
    private bpAuthService: BPAuthService,
    private paymentService : PaymentService
  ) { }

  ngOnInit(): void {
    this.getPaymentHistory()
    this.getUserCardDetails()
  }

  getPaymentHistory = ()=>{
    const userData = this.authUserService.getUser();
    this.paymentService.getPayments().subscribe(data => {
      this.dataSource = data;
    })
    const {_id} = this.authUserService.getUser() 
    this.bpAuthService.me().subscribe((user) => {
      this.userData = user;
      if (user.isPaidUser) {
        this.subscriptionStart = moment(user.subscriptionActiveUntil).subtract("1", "month").format('DD MMM YYYY');
        this.subscriptionEnd = moment(user.subscriptionActiveUntil).format('DD MMM YYYY')
      }
    });
  }

  getUserCardDetails = ()=>{
    const {_id} = this.authUserService.getUser();
    this.paymentService.getUserCardDetails(_id).subscribe((data)=>{
      if(data.message !== "Not a Subscribed User"){
        this.userCardDetail = data;
      }
    } , 
    (error) => {
      Swal({
        type: "error",
        title: ` ${error.error.name}!`,
        text: error.error.message,
      });
    }
    )
  }

 
  openCancelModal = () => {
    swal.fire({
      title: 'We’re sad to see you go. Please tell us what we could have done to improve.',
      input: 'text',
      inputLabel: 'Why?????',
      confirmButtonText: `That's why!`,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
        this.cancelRenewal();
      }
    })

  }

  successSubscription = (res) => {
    localStorage.setItem("user" , JSON.stringify({...this.userData , isPaidUser : true , subscriptionId : res.id , stripeCustomerId : res.customer}))
    this.paymentService.getPayments().subscribe(data => {
      this.dataSource = data;
    })
    this.getPaymentHistory()
    this.getUserCardDetails()
    Swal('Success!', 'Payment Successful.', 'success');
  }

  successEdit = (res)=>{
    this.paymentService.getPayments().subscribe(data => {
      this.dataSource = data;
      this.isCardReplace = false;
      this.getUserCardDetails()
      Swal('Success!', 'Update Successful.', 'success');
    },
      (error) => {
        Swal({
        type: "error",
        title: `${error.error.name}!`,
        text: error.error.message,
      });
    });
  }

  cancelRenewal = () => {
    this.paymentService.cancelSubscriptionRenewal().subscribe(data => {
      localStorage.setItem("user" , JSON.stringify({...this.userData , subscriptionCancellationRequested : true }))
      this.bpAuthService.me().subscribe((user) => {
        this.userData = user;
      });
      Swal('Success!', 'Renewal Cancelled', 'success');
    });
  }

  activateTab = (tab) => {
    this.activeTab = tab;
  }

  handleCardReplace = ()=> this.isCardReplace = true;

  cancelCardReplace = ()=> this.isCardReplace = false;

}
