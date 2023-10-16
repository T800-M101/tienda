import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Coupon } from '../models/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  couponToDelete!: Coupon;
  public url!: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

   // ***** SET and GET methods are to enable the modal to access the record to be deleted *****
   setCouponToDelete(coupon: Coupon): void {
    this.couponToDelete = coupon;
  }

  getCouponToDelete(): any {
    return this.couponToDelete;
  }

  getCoupons(token: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this.http.get(this.url+'getCoupons', { headers });
  }

  getCouponById(id:string, token:string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + 'getCouponById/'+ id, { headers });
  }

  createCoupon(coupon: any, token: string): Observable<any> {
    let headers = new HttpHeaders({'Authorization': token});
    return this.http.post(this.url+'create_coupon', coupon, { headers })
  }

  updateCoupon(id: string, data: any, token: string): Observable<any> {
      let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
      return this.http.put(this.url+'updateCoupon/'+id, data, {headers});
  }
  

  deleteCoupon(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete(this.url + 'deleteCoupon/'+ id, { headers });
  }

}
