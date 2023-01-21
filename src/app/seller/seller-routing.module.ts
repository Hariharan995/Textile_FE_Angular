import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillComponent } from './components/bill/bill.component';

const routes: Routes = [
  {
    path: '',
    component: BillComponent
  },
  {
    path: 'bill',
    component: BillComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
