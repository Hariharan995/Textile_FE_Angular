import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAndRegisterationPageComponent } from './containers/login-and-registeration-page/login-and-registeration-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginAndRegisterationPageComponent,
  },
  {
    path: '',
    component: LoginAndRegisterationPageComponent,
  },
  // {
  //   path: 'login/:pageType',
  //   component: LoginAndRegisterationPageComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
