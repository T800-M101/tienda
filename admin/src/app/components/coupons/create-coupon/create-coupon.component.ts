import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ERROR, SUCCESS } from 'src/app/colors/popup-colors';
import { showAlert } from 'src/app/helpers/alerts';
import { Coupon } from 'src/app/models/coupon';
import { AdminService } from 'src/app/services/admin.service';
import { CouponService } from 'src/app/services/coupon.service';
import { FormValidator } from 'src/app/services/form-validator.service';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.css'],
})
export class CreateCouponComponent implements OnInit, OnDestroy{
  @ViewChild('btnCreate') btnCreate: any;
  formInvalid!: boolean;
  coupon = new Coupon();
  token!: string;
  couponSubscription$:any = Subscription;

  constructor(
    private formValidator: FormValidator,
    private couponService: CouponService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    if (this.couponSubscription$) {
      this.couponSubscription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.token = this.adminService.getToken();
  }

  createCoupon(registerForm: NgForm): void {
    this.btnCreate.nativeElement.classList.add('active');
    setTimeout(() => {
      this.btnCreate.nativeElement.classList.remove('active');
    }, 100);

    // Validate form
    const validForm = this.formValidator.validateForm(registerForm);
    if (!validForm) {
      this.formInvalid = true;
      return;
    }

    this.coupon = registerForm.value;
    this.couponSubscription$ = this.couponService.createCoupon(this.coupon, this.token).subscribe({
      next: (resp) => {
       showAlert('SUCCESS:', 'Coupon created.', SUCCESS);
       this.router.navigate(['panel/coupons']);
       registerForm.resetForm();
      },
      error: (err) => {
       const message = err.error.message;
       showAlert('ERROR:',message, ERROR);
      }
   });
  }
}
