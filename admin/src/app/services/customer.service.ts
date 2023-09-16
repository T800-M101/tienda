import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  public url!: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  getCustomers(token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this.http.get(this.url+'getCustomers', { headers });
  }

  createCustomer(customer: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.url+'register_customer', customer, { headers})
  }

}
