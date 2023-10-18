import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public url!: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  } 



  getConfig(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + 'getConfig', { headers });
  }

  getConfigPublic(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.get(this.url + 'getConfigPublic', { headers });
  }

  updateConfig(id: string, data:any, token: string): Observable<any> {
    if (data.logo) {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('serie', data.serie);
      formData.append('correlative', data.correlative);
      formData.append('categories', JSON.stringify(data.categories));
      formData.append('logo', data.logo);
      
      let headers = new HttpHeaders({'Authorization': token});
      return this.http.put(this.url + 'updateConfig/'+ id, formData, { headers });
      
    } else {
      let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
      return this.http.put(this.url+'updateConfig/'+ id, data, { headers });
    }
  }
}
