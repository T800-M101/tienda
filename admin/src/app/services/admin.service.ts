import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private userIsNotAdmin = new Subject<boolean>();
  private adminToDelete: any;
  public url!: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  } 
  
  // ***** SET and GET methods are to enable the modal to access the record to be deleted *****
  setAdminToDelete(admin: any): void {
    this.adminToDelete = admin;
  }

  getAdminToDelete(): any {
    return this.adminToDelete;
  }
  // ******************************************************************************************

  loginAdmin(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.url + 'login_admin', data, { headers });
  }

  setLocalStorage(data: any): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('_id', data.admin._id);
  }

  getToken(): string {
    const token = localStorage.getItem('token');
    if (token) return token;
    return '';
  }

  isUserAdmin(): Observable<boolean> {
    return this.userIsNotAdmin.asObservable();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    const helper = new JwtHelperService();
    return helper.isTokenExpired(token);
  }

  // In the allowedRoles array are included the roles that are allowed to log in
  isAuthenticated(allowedRoles: string[]): boolean {
    const token = this.getToken();
    let decodeToken;
    if (!token) return false;

    try {
      // Token is decodificated
      const helper = new JwtHelperService();
      decodeToken = helper.decodeToken(token);

      // Verify that token is valid, otherwise it is removed.
      if (!decodeToken) {
        localStorage.removeItem('token');
        return false;
      }
    } catch (error) {
      // Verify that token has errors, otherwise it is removed.
      localStorage.removeItem('token');
      return false;
    }
    // Notify that the user trying to access is not admin
    if (!allowedRoles.includes(decodeToken['role'])) {
      this.userIsNotAdmin.next(false);
    }
    // Verify if the admin role is included in array
    return allowedRoles.includes(decodeToken['role']);
  }

  getAdmins(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + 'getAdmins', { headers });
  }

  createAdmin(admin: any, token:string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post(this.url + 'register_admin', admin, { headers })
  }

  getAdminById(id: string, token:string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + 'getAdminById/'+ id, { headers });
  }

  updateAdmin(id: string, data: any, token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(this.url + 'updateAdmin/'+ id, data, { headers });
  }

  deleteAdmin(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete(this.url + 'deleteAdmin/'+ id, { headers });
  }
}
