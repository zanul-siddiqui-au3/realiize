import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SocialAuthService } from 'angularx-social-login';
import * as moment from "moment";
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../payment/payment.service';
import { AdminUserService } from '../admin-user.service';
import Swal from "sweetalert2";
import swal from "sweetalert2/dist/sweetalert2.js";
@Component({
  selector: 'app-admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  styleUrls: ['./admin-user-detail.component.scss']
})
export class AdminUserDetailComponent implements OnInit {

  userId;
  userData;
  dataSource : []=  [];
  activeTab = 'profile';
  subscriptionStart;
  subscriptionEnd;
  userCardDetail;
  displayedColumns: string[] = ['date', 'amount'];

  constructor(
    private router: Router,
    private authService: SocialAuthService,
    private paymentService : PaymentService,
    private adminUserService : AdminUserService,
    private route: ActivatedRoute) {
      this.userId= this.route.snapshot.paramMap.get('id');
    }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData = ()=>{
    this.adminUserService.getOne(this.userId).subscribe((data)=>{
      this.userData = data;
      this.getUserCardDetails();
      this.getPaymentHistory();
    } ,
    (err)=>{
      Swal({
        type: "error",
        title: ` ${err.error.name}!`,
        text: err.error.message,
        });
      }
    )
  }

  getPaymentHistory = ()=>{
    this.paymentService.getPaymentsById(this.userData._id).subscribe(data => {
      this.dataSource = data;
    })
      if (this.userData.isPaidUser) {
        this.subscriptionStart = moment(this.userData.subscriptionActiveUntil).subtract("1", "month").format('DD MMM YYYY');
        this.subscriptionEnd = moment(this.userData.subscriptionActiveUntil).format('DD MMM YYYY')
      }
  }

  getUserCardDetails = ()=>{
    this.paymentService.getUserCardDetails(this.userData._id).subscribe((data)=>{
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

  cancelRenewal = () => {
    this.paymentService.cancelSubscriptionRenewal(this.userData.subscriptionId).subscribe(data => {
      Swal('Success!', 'Renewal Cancelled', 'success');
      this.getUserData()
    }, 
    (err)=>{
      Swal({
        type: "error",
        title: ` ${err.error.name}!`,
        text: err.error.message,
      });
    }
    );
  }

  activateTab = (tab) => {
    this.activeTab = tab;
  }


}
