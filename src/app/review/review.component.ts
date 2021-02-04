import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { ReviewService } from './../review.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  constructor(private reviewService: ReviewService) { }
  maxStar = 5;
  review = {};
  ngOnInit() {
  }

  public submitReviewForm() {
    this.reviewService.create(this.review)
      .subscribe((data) => {
        Swal('Success!', 'Thanks for your review!', 'success');
      },
      (err) => {
        console.log(err);
        Swal('Error!', 'Unable to update your review!', 'error');
      }
      );
  }

}
