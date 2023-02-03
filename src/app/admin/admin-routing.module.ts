import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyerListComponent } from './components/buyer-list/buyer-list.component';
import { CreditPointComponent } from './components/credit-point/credit-point.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SaleListComponent } from './components/sale-list/sale-list.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: SaleListComponent
  },
  {
    path: 'user-list',
    component: UserListComponent,
  },
  {
    path: 'buyer-list',
    component: BuyerListComponent,
  },
  {
    path: 'product-list',
    component: ProductListComponent,
  },
  {
    path: 'sale-list',
    component: SaleListComponent,
  },
  {
    path: 'credit-point',
    component: CreditPointComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
