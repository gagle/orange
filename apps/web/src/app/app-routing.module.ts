/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * In a real application create and edit pages are often joined in the same page
 * in order to reuse the template and avoid full page reload.
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    canActivate: [],
    loadChildren: () => import('./features/overview/overview.module').then(m => m.OverviewModule),
  },
  // {
  //   path: 'create',
  //   loadChildren: () => import('./features/create/create.module').then(m => m.CreateModule),
  // },
  {
    path: 'edit/:postId',
    loadChildren: () => import('./features/edit/edit.module').then(m => m.EditModule),
  },
  // {
  //   path: 'details',
  //   loadChildren: () => import('./features/details/details.module').then(m => m.DetailsModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
