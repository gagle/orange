import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { OverviewPageComponent } from './overview.component';

describe('OverviewPageComponent', () => {
  let spectator: Spectator<OverviewPageComponent>;
  let component: OverviewPageComponent;

  const createComponent = createComponentFactory({
    component: OverviewPageComponent,
    imports: [HttpClientTestingModule],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
