import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { showAlert } from '../../../helpers/alerts';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { FormValidator } from 'src/app/services/form-validator.service';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css'],
})
export class EditAdminComponent implements OnInit, OnDestroy {
  admin = new Admin();
  id!: string;
  token = '';
  adminSubscription$: any = Subscription;
  routeSubscription$: any = Subscription;
  dataLoaded!: boolean;
  notFound = false;
  formInvalid!: boolean;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router,
    private formValidator:FormValidator
  ) {}

  ngOnInit(): void {
    this.routeSubscription$ = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

    this.token = this.adminService.getToken();

    this.dataLoaded = false;
    this.adminSubscription$ = this.adminService
      .getAdminById(this.id, this.token)
      .subscribe({
        next: (response) => {
          this.admin.name = response.data.name;
          this.admin.lastname = response.data.lastname;
          this.admin.email = response.data.email;
          this.admin.phone = response.data.phone;
          this.admin.role = response.data.role;
          this.admin.dni = response.data.dni;
          this.dataLoaded = true;
        },
        error: (error) => {
          this.notFound = true;
          this.dataLoaded = true;
          if (error && !error.error.message)
            showAlert('ERROR:', error.error.message, '#FF0000');
        },
      });
  }

  ngOnDestroy(): void {
    this.adminSubscription$.unsubscribe();
    this.routeSubscription$.unsubscribe();
  }

  updateAdmin(form: NgForm): void {
    const validForm = this.formValidator.validateForm(form);
    if (!validForm) {
      this.formInvalid = true;
      return;
    }

    this.admin = form.value;
    this.adminSubscription$ = this.adminService
      .updateAdmin(this.id, this.admin, this.token)
      .subscribe({
        next: (response) => {
          showAlert('SUCCESS:', response.message, '#7fcb5f');
          this.router.navigate(['/panel/admins']);
        },
        error: (error) => {
          showAlert('SUCCESS:', error.message, '#7fcb5f');
        },
      });
  }

}
