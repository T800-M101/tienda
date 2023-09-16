import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { showAlert } from '../../../helpers/alerts';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { SUCCESS } from '../../../colors/popup-colors';
import { FormValidator } from 'src/app/services/form-validator.service';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit, OnDestroy {
  admin = new Admin();
  token = '';
  adminSubscription$:any = Subscription;
  adminCreated = false;
  formInvalid!: boolean;
  
  
  constructor(private adminService:AdminService, private router: Router, private formValidator:FormValidator){}
  
  ngOnInit(): void {
    this.token = this.adminService.getToken();
  }
  
  ngOnDestroy(): void {
    if(this.adminCreated) this.adminSubscription$.unsubscribe();
  }


  createAdmin(form: NgForm): void {
    const validForm = this.formValidator.validateForm(form);
    if (!validForm) {
      this.formInvalid = true;
      return;
    }

    this.admin = form.value;
    this.adminSubscription$ = this.adminService.createAdmin(this.admin, this.token).subscribe(response => {
      this.adminCreated = true;
      showAlert('SUCCESS:', 'Admin created.', SUCCESS);
      this.router.navigate(['/panel/admins']);
    });
  }

}
