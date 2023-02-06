import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRoutingModule } from './seller-routing.module';
import { BillComponent } from './components/bill/bill.component';
import { SharedModule } from '../shared/shared.module';
import { AdminModule } from '../admin/admin.module';
import { AddToCartDialogComponent } from './components/add-to-cart-dialog/add-to-cart-dialog.component';
import { MaterialModule } from '../material.module';
import { BuyerDialogComponent } from './components/buyer-dialog/buyer-dialog.component';


@NgModule({
  declarations: [BillComponent, AddToCartDialogComponent, BuyerDialogComponent],
  imports: [
    CommonModule,
    SellerRoutingModule,
    AdminModule,
    MaterialModule,
    SharedModule,
  ],
})
export class SellerModule {}
