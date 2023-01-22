import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRoutingModule } from './seller-routing.module';
import { BillComponent } from './components/bill/bill.component';
import { SharedModule } from '../shared/shared.module';
import { AdminModule } from '../admin/admin.module';


@NgModule({
  declarations: [
    BillComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    AdminModule,
    SharedModule
  ]
})
export class SellerModule { }
