import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { AdminComponent } from './admin.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SaleListComponent } from './components/sale-list/sale-list.component';
import { DialogComponent } from './components/dialog/dialog.component';


@NgModule({
  declarations: [
    UserListComponent,
    AdminComponent,
    ProductListComponent,
    SaleListComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule, 
    MaterialModule,  
    SharedModule 
  ]
})
export class AdminModule { }
