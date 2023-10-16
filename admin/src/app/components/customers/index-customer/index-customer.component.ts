import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-index-customer',
  templateUrl: './index-customer.component.html',
  styleUrls: ['./index-customer.component.css']
})
export class IndexCustomerComponent implements OnInit, OnDestroy {
  customers: any = [];
  filteredCustomer = '';
  page = 1;
  pageSize = 20;
  token = '';
  adminSubscription$: any = Subscription;
  constructor(private customerService: CustomerService, private adminService: AdminService){}
  
  ngOnInit(): void {
    this.token = this.adminService.getToken();
    this.adminSubscription$ = this.customerService.getCustomers(this.token).subscribe(customers => {
      this.customers = customers.data;
    });
  }

  ngOnDestroy(): void {
    if (this.adminSubscription$) {
      this.adminSubscription$.unsubscribe();
    }
  }
}
