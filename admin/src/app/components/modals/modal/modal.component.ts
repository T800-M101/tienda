import { Component, EventEmitter,  OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { showAlert } from 'src/app/helpers/alerts';
import { AdminService } from 'src/app/services/admin.service';
import { ModalService } from 'src/app/services/modal.service';
import { ERROR, SUCCESS } from '../../../colors/popup-colors';
import { ProductService } from 'src/app/services/product.service';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  @Output() onCloseModal = new EventEmitter<void>();

  switchModal!: boolean;
  token!: string;
  adminToDelete!: any;
  productToDelete:any;
  couponToDelete:any;
  inventoryToDelete:any;
  itemToDelete!: string;
  private adminSubscription$!:Subscription;
  private productSubscription$!: Subscription;
  private couponSubscription$!: Subscription;
  private inventorySubscription$!: Subscription;
  private id!: string;

  constructor(
      private modalService: ModalService, 
      private adminService: AdminService,
      private productService: ProductService,
      private couponService: CouponService){}
  
  ngOnInit(): void {
    this.token = this.adminService.getToken();
    this.itemToDelete = this.modalService.getItemToDelete();

    if (this.itemToDelete === 'admin') {
      this.adminToDelete = this.adminService.getAdminToDelete();
      this.id = this.adminToDelete._id;
    }

    if (this.itemToDelete === "product") {
      this.productToDelete = this.productService.getProductToDelete();
      this.id = this.productToDelete._id;    
    }
    
    if (this.itemToDelete === "inventory") {
      this.inventoryToDelete = this.productService.getInventoryToDelete();
      this.id = this.inventoryToDelete._id;
    }

    if (this.itemToDelete === "coupon") {
      this.couponToDelete = this.couponService.getCouponToDelete();
      this.id = this.couponToDelete._id;
    }

  }
  
  ngOnDestroy(): void {
    if(this.adminSubscription$) {
      this.adminSubscription$.unsubscribe();
    }
    if(this.productSubscription$) {
      this.productSubscription$.unsubscribe();
    }

    if(this.inventorySubscription$) {
      this.inventorySubscription$.unsubscribe();
    }

    if(this.couponSubscription$) {
      this.couponSubscription$.unsubscribe();
    }
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  deleteItem(): void {
    if(this.itemToDelete === 'admin') {
      this.deleteAdmin();
    }

    if (this.itemToDelete === 'product') {
      this.deleteProduct();
    }

    if (this.itemToDelete === 'inventory') {
      this.deleteInventory();
    }

    if (this.itemToDelete === 'coupon') {
      this.deleteCoupon();
    }
  }

  deleteAdmin(): void {
    this.adminSubscription$ = this.adminService.deleteAdmin(this.id, this.token).subscribe({
      next: (response) => {
       showAlert('SUCCESS:', response.message, SUCCESS);
       this.onCloseModal.emit();
       this.modalService.closeModal();
      },
      error: (error) => {
        showAlert('ERROR:', error.error.message, ERROR);
      }
    });
         
  }

  deleteProduct(): void {
    this.productSubscription$ = this.productService.deleteProduct(this.id, this.token).subscribe({
      next: (response) => {
       showAlert('SUCCESS:', response.message, SUCCESS);
       this.onCloseModal.emit();
       this.modalService.closeModal();
      },
      error: (error) => {
        showAlert('ERROR:', error.error.message, ERROR);
      }
    });
         
  }

  deleteCoupon(): void {
    this.couponSubscription$ = this.couponService.deleteCoupon(this.id, this.token).subscribe({
      next: (response) => {
       showAlert('SUCCESS:', response.message, SUCCESS);
       this.onCloseModal.emit();
       this.modalService.closeModal();
      },
      error: (error) => {
        showAlert('ERROR:', error.error.message, ERROR);
      }
    });
         
  }

  deleteInventory(): void {
    this.inventorySubscription$ = this.productService.deleteInventoryById(this.id, this.token).subscribe({
      next: (response) => {
       showAlert('SUCCESS:', response.message, SUCCESS);
       this.onCloseModal.emit();
       this.modalService.closeModal();
      },
      error: (error) => {
        showAlert('ERROR:', error.error.message, ERROR);
      }
    });
  }

}
