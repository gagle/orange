import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditPageComponent } from './edit.component';

const routes: Routes = [
  {
    path: '',
    component: EditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRoutingModule {}
