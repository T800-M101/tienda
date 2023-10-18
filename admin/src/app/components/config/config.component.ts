import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ERROR, SUCCESS } from 'src/app/colors/popup-colors';
import { showAlert } from 'src/app/helpers/alerts';
import { Config } from 'src/app/models/config';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { ConfigService } from 'src/app/services/config.service';
import { FormValidator } from 'src/app/services/form-validator.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit, OnDestroy {
  @ViewChild('btnUpdate') btnUpdate: any;
  
  config = new Config();
  url!: string;
  title = '';
  icon = '';
  token = '';
  configSubscription$!: Subscription;
  formInvalid = false; 
  file!: File;
  imageTypeAllowed = true;
  imageSizeAllowed = true;
  imgSelected: any | ArrayBuffer;
  message = '';

  constructor(private configService: ConfigService, private adminService: AdminService, private formValidator: FormValidator){}
  
  ngOnDestroy(): void {
    if(this.configSubscription$) {
      this.configSubscription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.token = this.adminService.getToken();
    this.url = GLOBAL.url;
    this.configSubscription$ = this.configService.getConfig(this.token).subscribe({
      next: (resp) => {
        this.config = resp.config
        this.setLogo();
      },
      error: (error) => {console.log(error)}
    });
  }

  setLogo(): void {
    this.imgSelected = this.url +'getLogo/' + this.config.logo;
  }

  addCategory(): void {
    if(this.title === '' || this.icon === '') {
      showAlert('ERROR:','Please provide a title and icon for the category', ERROR);
    }
    this.config.categories.push({
      title: this.title, 
      icon: this.icon,
      _id: uuidv4()
    });
    this.title = '';
    this.icon = '';
  }

  update(form: NgForm): void {
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

    // const data =  {
    //   title: form.value.title,
    //   serie: form.value.serie,
    //   correlative: form.value.correlative,
    //   categories: this.config.categories,
    //   logo: this.file
    // }

    this.config.title = form.value.title,
    this.config.serie = form.value.serie,
    this.config.correlative = form.value.correlative,
    this.config.logo = this.file


    this.configSubscription$ = this.configService.updateConfig('652d5e50eb970bd5ad0bc472', this.config, this.token).subscribe({
      next: (resp) => {
        showAlert('SUCCESS:', 'Configurations edited.', SUCCESS);
      },
      error: (error) => {
        showAlert('ERROR:',error, ERROR);
      }
    });
    
  }

  deleteCategory(index: number): void {
    this.config.categories.splice(index, 1);
  }

  fileChangeEvent(event: any): void {
    let logo = document.getElementById('logo');
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
      this.message = 'Image type not allowed.';
      if (logo) logo.innerText = file.name;
      return;
    }

    // Verify if it is an image and no bigger that 4 Gb
    if (fileExtensions.includes(file.type) && file.size >= 4000000) {
      this.imageTypeAllowed = true;
      this.imageSizeAllowed = false;
      this.message = 'Image size not allowed.'
      if (logo) logo.innerText = file.name;
      return;
    }

    // Verify if it is an image and smaller than 4 Gb
    if (fileExtensions.includes(file.type) && file.size < 4000000) {
      this.imageTypeAllowed = true;
      this.imageSizeAllowed = true;
      if (logo) logo.innerText = file.name;
    }

    const reader = new FileReader();
    reader.onload = (e) => (this.imgSelected = reader.result);
    reader.readAsDataURL(file);
    this.file = file;
  }

  ngDoCheck(): void {
    document.getElementById('imgDropPreview');
  }

}
