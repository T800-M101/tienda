import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Coupon } from 'src/app/models/coupon';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { CouponService } from 'src/app/services/coupon.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-index-coupon',
  templateUrl: './index-coupon.component.html',
  styleUrls: ['./index-coupon.component.css']
})
export class IndexCouponComponent implements OnInit, OnDestroy {

  coupons:Coupon[] = [];
  page = 1;
  pageSize = 20;
  filter = '';
  token = '';
  url = '';
  filteredCoupons = '';
  modalSubscription$!: Subscription;
  couponSubscription$!: Subscription;
  modalSwitch!: boolean;


  constructor(
    private couponService: CouponService, 
    private adminService: AdminService,
    private modalService: ModalService){}

ngOnInit(): void {
  this.modalSubscription$ = this.modalService.getModalState().subscribe((modalState: boolean) => {
    this.modalSwitch = modalState;
  });
  this.url = GLOBAL.url;
  this.token = this.adminService.getToken();
  this.getCoupons();
}

ngOnDestroy(): void {
  if(this.modalSubscription$) {
    this.modalSubscription$.unsubscribe();
  }
  if(this.couponSubscription$) {
    this.couponSubscription$.unsubscribe();
  }
}

getCoupons(): void {
  this.couponSubscription$ = this.couponService.getCoupons(this.token).subscribe( {
    next: (response ) => {
      this.coupons = response.data;
    },
    error: (error) => {
      console.log(error)
    }
  })
}


openModal(coupon: Coupon, item: string): void {
  this.couponService.setCouponToDelete(coupon); // the coupon to delete is set so the modal can access the id to delete the recocrd
  this.modalService.openModal(item);
  this.modalSubscription$ = this.modalService.getModalState().subscribe((modalState: boolean) => {
    this.modalSwitch = modalState;
  });

}

onCloseModal(event: void): void {
  this.getCoupons();
}

}
