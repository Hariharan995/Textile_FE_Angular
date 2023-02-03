import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SaleListComponent } from './components/sale-list/sale-list.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component';
import { CreditPointComponent } from './components/credit-point/credit-point.component';
import { EditCreditPointComponent } from './components/edit-credit-point/edit-credit-point.component';
import { BuyerListComponent } from './components/buyer-list/buyer-list.component';


@NgModule({
  declarations: [
    UserListComponent,
    ProductListComponent,
    SaleListComponent,
    DialogComponent,
    AddProductDialogComponent,
    CreditPointComponent,
    EditCreditPointComponent,
    BuyerListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule, 
    MaterialModule,  
    SharedModule 
  ]
})
export class AdminModule { }
