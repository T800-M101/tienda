import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { showAlert } from '../../helpers/alerts';
import { Subscription } from 'rxjs';
import { ERROR } from '../../colors/popup-colors';

declare const jquery: any;
declare const $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public admin = {
    email: '',
    password: ''
  };

  loggedAdmin = {};
  token = '';
  notAllowedSubscription!: Subscription;
  adminSubscription$: any = Subscription;
  notAllowedLoginAttempts = 0;

  constructor(private adminService: AdminService, private router: Router) { }
  
  ngOnInit(): void {
    // Validate if there is token in localStorage and the token hasn't expired, if so redirect user to admin panel or login page.
    this.token = this.adminService.getToken();
    if(this.token && !this.adminService.isTokenExpired()) this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if(this.notAllowedSubscription) this.notAllowedSubscription.unsubscribe();
    this.adminSubscription$.unsubscribe();
  }

  private preventNotAdminsToLogin(loginForm: NgForm): void {
    if(this.notAllowedLoginAttempts > 0) this.notAllowedLoginAttempts = 0;
    this.notAllowedSubscription = this.adminService.isUserAdmin().subscribe(response => {
      if(this.notAllowedLoginAttempts > 0) return;
        showAlert('WARNING:','You are not allowed to access this site!', ERROR);
        this.notAllowedLoginAttempts++;
        loginForm.resetForm();
    });
  }

  login(loginForm: NgForm): void {
    // Prevent unauthorized users to login and notify it.
    this.preventNotAdminsToLogin(loginForm);

    if(!loginForm.valid) return showAlert('ERROR:','Your credentials are incorrect.', ERROR);
    
    this.admin = loginForm.value;
    this.adminSubscription$ = this.adminService.loginAdmin(this.admin).subscribe({
          next: (response) => {
            this.loggedAdmin = response.admin;
            // Store token y id in localstorage
            this.adminService.setLocalStorage(response);
            this.router.navigate(['/']);
          },
          error: (error) => {
            const message = error.error.message;
            showAlert('ERROR:',message, ERROR);
            loginForm.resetForm();
          }
        }
      )
  } 
}