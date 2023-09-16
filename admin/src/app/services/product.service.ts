import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productToDelete: any;
  private inventoryToDelete: any;
  
  public url!: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  } 


  createProduct(data: any, file: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Authorization': token});
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('stock', data.stock);
    formData.append('price', data.price);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('category', data.category);
    formData.append('portada', file);
   
    return this.http.post(this.url+'register_product', formData, { headers })
  }

  // ***** SET and GET methods are to enable the modal to access the record to be deleted *****
  setProductToDelete(product: any): void {
    this.productToDelete = product;
  }

  getProductToDelete(): any {
    return this.productToDelete;
  }


  setInventoryToDelete(inventory: any): void {
    this.inventoryToDelete = inventory;
  }

  getInventoryToDelete(): any {
    return this.inventoryToDelete;
  }
  // ******************************************************************************************

  getProducts(filter: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Authorization': token});
    return this.http.get(this.url+'getProducts/'+filter, {headers});
     
  }

  getProductById(id:string, token:string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + 'getProductById/'+ id, { headers });
  }

  updateProduct(id: string, data: any, token: string): Observable<any> {
    if (data.portada) {
      let headers = new HttpHeaders({'Authorization': token});
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('stock', data.stock);
      formData.append('price', data.price);
      formData.append('description', data.description);
      formData.append('content', data.content);
      formData.append('category', data.category);
      formData.append('portada', data.portada);
      
      return this.http.put(this.url + 'updateProduct/'+ id, formData, { headers });
      
    } else {
      let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
      return this.http.put(this.url+'updateProduct/'+id, data, {headers});
    }
  }

  deleteProduct(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete(this.url + 'deleteProduct/'+ id, { headers });
  }

  getInventoryById(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + 'getInventoryById/'+ id, { headers });
  }

  deleteInventoryById(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete(this.url + 'deleteInventoryById/'+ id, { headers });
  }

  modifyInventory(data: any, token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post(this.url + 'modifyInventory', data, { headers });
  }
}