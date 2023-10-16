import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ERROR, SUCCESS } from 'src/app/colors/popup-colors';
import { showAlert } from 'src/app/helpers/alerts';
import { Coupon } from 'src/app/models/coupon';
import { AdminService } from 'src/app/services/admin.service';
import { CouponService } from 'src/app/services/coupon.service';
import { FormValidator } from 'src/app/services/form-validator.service';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrls: ['./edit-coupon.component.css']
})
export class EditCouponComponent implements OnInit, OnDestroy{
  @ViewChild('btnUpdate') btnUpdate: any;
  coupon = new Coupon();
  formInvalid!: boolean;
  token = '';
  id = '';
  couponSubscription$!:Subscription;
  routeSubscription$!: Subscription;

  constructor(private formValidator: FormValidator, 
              private couponService: CouponService, 
              private adminService: AdminService, 
              private router: Router, 
              private route: ActivatedRoute){}

  ngOnDestroy(): void {
    if(this.couponSubscription$) {
      this.couponSubscription$.unsubscribe();
    }

    if(this.routeSubscription$) {
      this.routeSubscription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.routeSubscription$ = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

    this.token = this.adminService.getToken();

    
    this.couponSubscription$ = this.couponService
      .getCouponById(this.id, this.token)
      .subscribe({
        next: (response) => {
          this.coupon = response.data;
        },
        error: (error) => {
          if (error && !error.error.message)
            showAlert('ERROR:', error.error.message, '#FF0000');
        },
      });
  }

 

  editCoupon(form: NgForm): void {
    this.coupon = form.value;
    this.btnUpdate.nativeElement.classList.add('active');
    setTimeout(()=> {
      this.btnUpdate.nativeElement.classList.remove('active');
    },100);

   // Validate form
    const validForm = this.formValidator.validateForm(form);
    if (!validForm) {
      this.formInvalid = true;
      return;
    }

    this.couponService.updateCoupon(this.id, this.coupon, this.token).subscribe({
       next: (resp) => {
        showAlert('SUCCESS:', 'Coupon edited.', SUCCESS);
        this.router.navigate(['panel/coupons']);
        form.resetForm();
       },
       error: (err) => {
        let message = '';
        if(err.error.message) {
          message = err.error.message;
          showAlert('ERROR:',message, ERROR);
        } else {
          message = err.statusText;
          showAlert('ERROR:',message, ERROR);
        }
       }
    });
    
  }

}
