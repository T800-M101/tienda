import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ERROR, SUCCESS } from 'src/app/colors/popup-colors';
import { showAlert } from 'src/app/helpers/alerts';
import { Inventory } from 'src/app/models/inventory';
import { Product } from 'src/app/models/product';
import { AdminService } from 'src/app/services/admin.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-inventory-product',
  templateUrl: './inventory-product.component.html',
  styleUrls: ['./inventory-product.component.css']
})
export class InventoryProductComponent implements OnInit, OnDestroy {
  product = new Product();
  inventoryProduct!: string;
  id!: string;
  token!: string;
  idUser!: string | null;
  productSubscription$!: Subscription;
  inventorySubscription$!: Subscription;
  modalSubscription$!: Subscription;
  inventories:any =  [];
  inventory:any =  {};
  modalSwitch!: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private productService: ProductService,
    private adminService: AdminService,
    private modalService: ModalService){}
    
    ngOnDestroy(): void {
      if (this.productSubscription$) this.productSubscription$.unsubscribe();
      if (this.inventorySubscription$) this.inventorySubscription$.unsubscribe();
      if (this.modalSubscription$) this.modalSubscription$.unsubscribe();
  }
  
  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.id = params['id'];
        this.token = this.adminService.getToken();

        if (localStorage.getItem('_id')) {
          this.idUser = localStorage.getItem('_id');
        }
        this.productSubscription$ = this.productService.getProductById(this.id, this.token).subscribe({
          next: (data) => {
            this.inventoryProduct = data.data._id;
            this.mapProduct(data.data);  
          },
          error: (error) => {console.log(error)}
        });

        this.getInventory();
      },
      error: (error) => {console.log(error)}
    });
  }
  
  
  getInventory(): void {
    this.inventorySubscription$ = this.productService.getInventoryById(this.id, this.token).subscribe({
      next: (inventory) => {
        if (inventory.data) {
          this.inventories = inventory.data;
        }
      },
      error: (error) => {console.log(error)}
    });
  }

  mapProduct(data: any) {
    this.product.name = data.name;
    this.product.image = data.portada;
    this.product.price = data.price;
    this.product.category = data.category;
    this.product.description = data.description;
    this.product.content = data.content;
  }

  openModal(item: any, itemToDelete: string): void {
    this.productService.setInventoryToDelete(item); // the inventory to delete is set so the modal can access the id to delete the recocrd
    this.modalService.openModal(itemToDelete);
    this.modalSubscription$ = this.modalService.getModalState().subscribe((modalState: boolean) => {
      this.modalSwitch = modalState;
    });

  }

  onCloseModal(event: void): void {
    this.router.navigate(['panel/products']);
  }

  addInventory(form: NgForm): void {
    if (!form.valid) {
      showAlert('ERROR:', 'Inventory Invalid', ERROR);
    } else {
      const data = {
        admin: this.idUser,
        product: this.inventoryProduct,
        quantity: form.value.quantity,
        supplier: form.value.supplier
      };
      this.productService.modifyInventory(data, this.token).subscribe({
        next: (response) => {
          console.log(response)
          showAlert('SUCCESS:', response.message, SUCCESS);
          this.getInventory();
        },
        error:(error) => {
          showAlert('ERROR:', 'Inventory not modified', ERROR);
        }
      });
    }

  }
}
