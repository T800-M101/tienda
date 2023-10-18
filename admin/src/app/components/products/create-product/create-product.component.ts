import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { AdminService } from 'src/app/services/admin.service';
import { ProductService } from 'src/app/services/product.service';
import { ERROR, SUCCESS } from '../../../colors/popup-colors';
import { showAlert } from 'src/app/helpers/alerts';
import { FormValidator } from 'src/app/services/form-validator.service';
import { Subscription } from 'rxjs';
import { Config } from 'src/app/models/config';
import { ConfigService } from 'src/app/services/config.service';




@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit, OnDestroy {
  @ViewChild('btnCreate') btnCreate: any;

  product = new Product();
  file!: File;
  imageSizeAllowed = true;
  imageTypeAllowed = true;
  imgSelected: any | ArrayBuffer = 'assets/img/no-image.png';
  imageInvalid = false;
  formInvalid!: boolean;
  token: any;
  config = new Config();
  productSubscription$!:Subscription;
  configSubscription$!: Subscription;

  constructor( 
      private productService: ProductService, 
      private adminService: AdminService, 
      private router: Router,
      private formValidator: FormValidator,
      private configService: ConfigService) {}

  ngOnDestroy(): void {
    if(this.productSubscription$) {
      this.productSubscription$.unsubscribe();
    }

    if(this.configSubscription$) {
      this.configSubscription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.configSubscription$ = this.configService.getConfigPublic().subscribe( config => {this.config = config.config});
    this.token = this.adminService.getToken();
  }

  createProduct(form: NgForm): void {
    this.btnCreate.nativeElement.classList.add('active');
    setTimeout(()=> {
      this.btnCreate.nativeElement.classList.remove('active');
    },100);

    // Validate form
    const validForm = this.formValidator.validateForm(form);
    if (!validForm) {
      this.formInvalid = true;
      return;
    }
  
    this.productMapper(form);
    
    this.productSubscription$ = this.productService.createProduct(this.product, this.file, this.token).subscribe({
       next: (resp) => {
        showAlert('SUCCESS:', 'Product created.', SUCCESS);
        this.router.navigate(['panel/products']);
        form.resetForm();
       },
       error: (err) => {
        const message = err.error.message;
        showAlert('ERROR:',message, ERROR);
       }
    });
    
  }

  productMapper(form: NgForm): void {
    this.product.name = form.value.name;
    this.product.image = form.value.image;
    this.product.price = form.value.price;
    this.product.category = form.value.category;
    this.product.description = form.value.description;
    this.product.content = form.value.content;
  }


  fileChangeEvent(event: any): void {
    let portada = document.getElementById('portada-name');
    const fileExtensions = [
      'image/png',
      'image/webp',
      'image/jpg',
      'image/gif',
      'image/jpeg',
    ];
    let file;
    // Verify if a file is coming
    if (event.target.files && event.target.files[0])
      file = event.target.files[0];

    // Verify if it is an image
    if (!fileExtensions.includes(file.type)) {
      this.imageTypeAllowed = false;
      if (portada) portada.innerText = file.name;
      return;
    }

    // Verify if it is an image and no bigger that 4 Gb
    if (fileExtensions.includes(file.type) && file.size >= 4000000) {
      this.imageTypeAllowed = true;
      this.imageSizeAllowed = false;
      if (portada) portada.innerText = file.name;
      return;
    }

    // Verify if it is an image and smaller than 4 Gb
    if (fileExtensions.includes(file.type) && file.size < 4000000) {
      this.imageTypeAllowed = true;
      this.imageSizeAllowed = true;
      if (portada) portada.innerText = file.name;
    }

    const reader = new FileReader();
    reader.onload = (e) => (this.imgSelected = reader.result);
    reader.readAsDataURL(file);
    this.file = file;
  }
  
}