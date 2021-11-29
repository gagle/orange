import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { PostsTableComponent } from './posts-table.component';

@NgModule({
  declarations: [PostsTableComponent],
  imports: [CommonModule, MatTableModule],
  exports: [PostsTableComponent],
})
export class PostsTableModule {}
