import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { LoginComponent } from './components/login/login.component';
import { isAuthenticated } from './guards/admim.guard';
import { IndexCustomerComponent } from './components/customers/index-customer/index-customer.component';
import { CreateCustomerComponent } from './components/customers/create-customer/create-customer.component';
import { CreateAdminComponent } from './components/admins/create-admin/create-admin.component';
import { IndexAdminComponent } from './components/admins/index-admin/index-admin.component';
import { EditAdminComponent } from './components/admins/edit-admin/edit-admin.component';
import { CreateProductComponent } from './components/products/create-product/create-product.component';
import { IndexProductComponent } from './components/products/index-product/index-product.component';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { InventoryProductComponent } from './components/products/inventory-product/inventory-product.component';
import { CreateCouponComponent } from './components/coupons/create-coupon/create-coupon.component';
import { IndexCouponComponent } from './components/coupons/index-coupon/index-coupon.component';
import { EditCouponComponent } from './components/coupons/edit-coupon/edit-coupon.component';
import { ConfigComponent } from './components/config/config.component';

const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch: 'full'},
  {path:"home", component: StartComponent, canActivate: [isAuthenticated]},
  {path:"panel", children:[
    {path:'customers', component: IndexCustomerComponent, canActivate: [isAuthenticated]},
    {path:'customers/create', component: CreateCustomerComponent, canActivate: [isAuthenticated]},

    {path:'admins', component: IndexAdminComponent, canActivate: [isAuthenticated]},
    {path:'admins/create', component: CreateAdminComponent, canActivate: [isAuthenticated]},
    {path:'admins/edit/:id', component: EditAdminComponent, canActivate: [isAuthenticated]},

    {path:'products', component: IndexProductComponent, canActivate: [isAuthenticated]},
    {path:'products/create', component: CreateProductComponent, canActivate: [isAuthenticated]},
    {path:'products/edit/:id', component: EditProductComponent, canActivate: [isAuthenticated]},
    {path:'products/inventory/:id', component: InventoryProductComponent, canActivate: [isAuthenticated]},

    {path:'coupons', component: IndexCouponComponent, canActivate: [isAuthenticated]},
    {path:'coupons/create', component: CreateCouponComponent, canActivate: [isAuthenticated]},
    {path:'coupons/edit/:id', component: EditCouponComponent, canActivate: [isAuthenticated]},

    {path:'configurations', component: ConfigComponent, canActivate: [isAuthenticated]},


    
  ]},
  {path:"login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
