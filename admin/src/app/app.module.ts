import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { InicioComponent } from './components/inicio/inicio.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { IndexCustomerComponent } from './components/customers/index-customer/index-customer.component';
import { FilterPipe } from './pipes/filter.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateCustomerComponent } from './components/customers/create-customer/create-customer.component';
import { CreateAdminComponent } from './components/admins/create-admin/create-admin.component';
import { IndexAdminComponent } from './components/admins/index-admin/index-admin.component';
import { EditAdminComponent } from './components/admins/edit-admin/edit-admin.component';
import { ModalComponent } from './components/modals/modal/modal.component';
import { CreateProductComponent } from './components/products/create-product/create-product.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { IndexProductComponent } from './components/products/index-product/index-product.component';
import { NgOptimizedImage } from '@angular/common';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { InventoryProductComponent } from './components/products/inventory-product/inventory-product.component';
import { CreateCouponComponent } from './components/coupons/create-coupon/create-coupon.component';
import { IndexCouponComponent } from './components/coupons/index-coupon/index-coupon.component';
import { EditCouponComponent } from './components/coupons/edit-coupon/edit-coupon.component'

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    SidebarComponent,
    LoginComponent,
    IndexCustomerComponent,
    FilterPipe,
    CreateCustomerComponent,
    CreateAdminComponent,
    IndexAdminComponent,
    EditAdminComponent,
    ModalComponent,
    CreateProductComponent,
    IndexProductComponent,
    EditProductComponent,
    InventoryProductComponent,
    CreateCouponComponent,
    IndexCouponComponent,
    EditCouponComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    EditorModule,
    NgOptimizedImage 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
