import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [HeaderComponent, SpinnerComponent]
})
export class SharedModule {
  public static forRoot() {
    return { ngModule: SharedModule };
  }
}
