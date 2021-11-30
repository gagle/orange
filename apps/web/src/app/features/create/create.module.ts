import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CreatePageComponent } from './create.component';
import { CreateRoutingModule } from './create-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CreateRoutingModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  declarations: [CreatePageComponent],
})
export class CreateModule {}
