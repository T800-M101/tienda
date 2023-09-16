import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-index-product',
  templateUrl: './index-product.component.html',
  styleUrls: ['./index-product.component.css']
})
export class IndexProductComponent implements OnInit {

  products:any = [];
  page = 1;
  pageSize = 20;
  filter = '';
  token = '';
  url = '';
  filteredProduct = '';
  modalSubscription$!: Subscription;
  modalSwitch!: boolean;

  constructor(
      private productService: ProductService, 
      private adminService: AdminService,
      private modalService: ModalService){}

  ngOnInit(): void {
    this.modalSubscription$ = this.modalService.getModalState().subscribe((modalState: boolean) => {
      this.modalSwitch = modalState;
    });
    this.url = GLOBAL.url;
    this.token = this.adminService.getToken();
    this.getProducts();
  }
  
  ngOnDestroy(): void {
    this.modalSubscription$.unsubscribe();
  }
  
  getProducts(): void {
    this.productService.getProducts(this.filter, this.token).subscribe( response => {
      this.products = response.products;
    },
    error => console.log(error));
  }

  openModal(product: any, item: string): void {
    this.productService.setProductToDelete(product); // the procuct to delete is set so the modal can access the id to delete the recocrd
    this.modalService.openModal(item);
    this.modalSubscription$ = this.modalService.getModalState().subscribe((modalState: boolean) => {
      this.modalSwitch = modalState;
    });

  }

  onCloseModal(event: void): void {
    this.getProducts();
  }



}
