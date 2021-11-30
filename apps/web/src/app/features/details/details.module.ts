import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DetailsPageComponent } from './details.component';
import { DetailsRoutingModule } from './details-routing.module';

@NgModule({
  imports: [CommonModule, DetailsRoutingModule],
  declarations: [DetailsPageComponent],
})
export class DetailsModule {}
