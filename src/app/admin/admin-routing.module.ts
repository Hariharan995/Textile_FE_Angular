import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListPageComponent } from './containers/users-list-page/users-list-page.component';

const routes: Routes = [
  {
    path: 'user-list',
    component: UsersListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
