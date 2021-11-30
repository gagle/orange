import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { EditPageComponent } from './edit.component';
import { EditRoutingModule } from './edit-routing.module';

@NgModule({
  imports: [CommonModule, EditRoutingModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  declarations: [EditPageComponent],
})
export class EditModule {}
