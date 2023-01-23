import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthGuard } from './core/guards';

const routes: Routes = [
  {
    path: '',
    //canLoad: [AuthGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
   // canLoad: [AdminGuard],
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'seller',
   // canLoad: [AdminGuard],
    loadChildren: () => import('./seller/seller.module').then((m) => m.SellerModule),
  },
  // {
  //   path: 'seller',
  //   canLoad: [SellerGuard],
  //   loadChildren: () => import('./seller/adsellermin.module').then((m) => m.SellerModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
