import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from '../material.module';
import { AdminModule } from '../admin/admin.module';
import { RouterModule } from '@angular/router';
import { PaginatorComponent } from './components/paginator/paginator.component';


@NgModule({
  declarations: [
    HeaderComponent,
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [HeaderComponent, PaginatorComponent]
})
export class SharedModule {
  public static forRoot() {
    return { ngModule: SharedModule };
  }
}
