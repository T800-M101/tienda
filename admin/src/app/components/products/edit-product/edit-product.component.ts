import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { showAlert } from 'src/app/helpers/alerts';
import { Product } from 'src/app/models/product';
import { AdminService } from 'src/app/services/admin.service';
import { ProductService } from 'src/app/services/product.service';
import { ERROR, SUCCESS } from '../../../colors/popup-colors';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { FormValidator } from 'src/app/services/form-validator.service';
import { ConfigService } from 'src/app/services/config.service';
import { Config } from 'src/app/models/config';



@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit, OnDestroy {
  @ViewChild('btnUpdate') btnUpdate: any;
   
  product = new Product();
  file!: File;
  imageSizeAllowed = true;
  imageTypeAllowed = true;
  formInvalid!: boolean;
  token = '';
  id = '';
  imgSelected: any | ArrayBuffer;
  image = '';
  url = '';
  deleteImg = '';
  configSubscription$!: Subscription;
  config = new Config();
  routeSubscription$!:Subscription;

  constructor(
      private route: ActivatedRoute,  
      private router: Router, 
      private adminService:AdminService, 
      private productService: ProductService,
      private formValidator:FormValidator,
      private configService: ConfigService
      ){}
      
  ngOnDestroy(): void {
    if(this.routeSubscription$) {
      this.routeSubscription$.unsubscribe();
    }

    if(this.configSubscription$) {
      this.configSubscription$.unsubscribe();
    }
  }


  ngOnInit(): void {
    this.configSubscription$ = this.configService.getConfigPublic().subscribe( config => {this.config = config.config});
    this.url = GLOBAL.url;
    this.token = this.adminService.getToken();
    this.routeSubscription$ = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.productService.getProductById(this.id, this.token).subscribe({
        next: (data) => {
          this.deleteImg = data.data.portada;
          this.productMapper(data);
          this.imgSelected = this.url+'getPortada/'+data.data.portada;
        },
        error: (error) => {
          showAlert('ERROR:', 'This product does not exist in data base.', ERROR);
          this.router.navigate(['panel/products']);
        }
      });
    });    
  }


  editProduct(form: NgForm): void {
    this.product = form.value;
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

    let data: any = {};
    if (this.file) {
      data.portada = this.file;
    } 
    data.name = this.product.name;
    data.price = this.product.price;
    data.category = this.product.category;
    data.description = this.product.description;
    data.content = this.product.content;


    this.productService.updateProduct(this.id, data, this.token).subscribe({
       next: (resp) => {
        showAlert('SUCCESS:', 'Product edited.', SUCCESS);
        this.router.navigate(['panel/products']);
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

  productMapper(data: any): void {
    this.product.name = data.data.name;
    this.product.price = data.data.price;
    this.product.category = data.data.category;
    this.product.content = data.data.content;
    this.product.description = data.data.description;

  }

}
