import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit{
 
customer = {
  name: '',
  lastname: '',
  country: '',
  password: '',
  profile:'',
  email: '',
  phone: '',
  birthday: '',
  dni: '',
  genre: '',
}
token = '';

  constructor(private customerService: CustomerService, adminService:AdminService){}

  ngOnInit(): void {
    console.log()
  }



  createCustomer(registerForm: NgForm): void {
 
    // if (!registerForm.valid) return ;

    // this.customer = registerForm.value;
    // console.log(this.customer)
    // this.customerService.createCustomer(this.customer).subscribe(response => console.log(response))
  }


}
