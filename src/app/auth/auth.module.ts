import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginAndRegisterationPageComponent } from './containers/login-and-registeration-page/login-and-registeration-page.component';
import { RegisterationFormComponent } from './components/registeration-form/registeration-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [
    LoginAndRegisterationPageComponent,
    RegisterationFormComponent,
    LoginFormComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
  ]
})
export class AuthModule { }
