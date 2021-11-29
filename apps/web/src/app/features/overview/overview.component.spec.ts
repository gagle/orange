import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { TranslatePipe } from '@ngx-translate/core';
import { TabTitleService } from '@recall2/frontend-core';
import { MockPipe } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';

import { CampaignTableColumns, SortingOrder } from '@/api';
import {
  mockCampaignOverview,
  mockFieldPostFiltering,
  mockFieldPostFilteringCampaignType,
  mockFieldPostFilteringManufacturer,
  mockFieldPostFilteringStartDateFrom,
  mockFieldPostFilteringStartDateTo,
  mockFieldPostFilteringStatus,
  mockSortChange,
} from '@/api/mocks';
import {
  mockFieldFiltering,
  mockFieldFilteringCampaignType,
  mockFieldFilteringManufacturer,
  mockFieldFilteringStartDateFrom,
  mockFieldFilteringStartDateTo,
  mockFieldFilteringStatus,
} from '@/api/mocks/field-filtering.mock';
import { FieldSorting } from '@/api/models';
import { TableFiltersQuery } from '@/features/table-filters/store/table-filters.query';
import { TableFiltersStoreState } from '@/features/table-filters/store/table-filters.store';
import { CampaignNavigationService } from '@/shared';
import { TablePageEvent } from '@/shared/models/table-page-event.model';

import { OverviewPageComponent } from './overview.component';
import { OverviewQuery } from './store/overview.query';
import { OverviewStoreService } from './store/overview.store.service';

describe('OverviewPageComponent', () => {
  let spectator: Spectator<OverviewPageComponent>;
  let component: OverviewPageComponent;
  let tabTitleService: TabTitleService;
  let overviewQuery: OverviewQuery;

  const mockFieldSorting: FieldSorting = { field: 'code', orderBy: SortingOrder.Asc };
  const overviewValues$ = new BehaviorSubject(mockCampaignOverview);
  const filterState: TableFiltersStoreState = {
    currentFilter: 'code',
    code: [mockFieldFiltering],
    manufacturer: [mockFieldFilteringManufacturer],
    status: [mockFieldFilteringStatus],
    startDate: [
      {
        ...mockFieldFilteringStartDateFrom,
        value: `${mockFieldFilteringStartDateFrom.value} - ${mockFieldFilteringStartDateTo.value}`,
      },
    ],
    campaignType: [mockFieldFilteringCampaignType],
  };
  const campaignNavigationServiceStub: Partial<CampaignNavigationService> = {
    isFromAgendaItem: jest.fn(),
    navigateBack: jest.fn(),
    navigateToEdit: jest.fn(() => Promise.resolve(true)),
    navigateToCampaignsOverview: jest.fn(),
  };
  const overviewStoreServiceStub: Partial<OverviewStoreService> = {
    loadOverviewCampaign: jest.fn(),
    saveSorting: jest.fn(),
  };
  const tableFiltersQueryStub: Partial<TableFiltersQuery> = {
    currentFilter: 'code',
    allFilters: filterState,
  };

  let campaignNavigationService: CampaignNavigationService;
  let overviewStoreService: OverviewStoreService;

  const createComponent = createComponentFactory({
    component: OverviewPageComponent,
    declarations: [MockPipe(TranslatePipe)],
    imports: [HttpClientTestingModule],
    providers: [
      mockProvider(OverviewQuery),
      mockProvider(CampaignNavigationService, campaignNavigationServiceStub),
      mockProvider(TabTitleService),
      mockProvider(OverviewStoreService, overviewStoreServiceStub),
      mockProvider(TableFiltersQuery, tableFiltersQueryStub),
    ],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    campaignNavigationService = spectator.inject(CampaignNavigationService);
    tabTitleService = spectator.inject(TabTitleService);
    overviewQuery = spectator.inject(OverviewQuery);
    overviewStoreService = spectator.inject(OverviewStoreService);
    spectator.inject<TableFiltersQuery>(TableFiltersQuery);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set browser tab title', () => {
    const tabTitleSpy = jest.spyOn(tabTitleService, 'setTitleByKey');
    spectator.detectChanges();
    expect(tabTitleSpy).toHaveBeenCalledWith('campaigns.overview.tab-title');
  });

  it('onSortChange(): should load campaigns with new sorting', () => {
    const spy = jest.spyOn(component, 'onSortChange');

    overviewValues$.next(mockCampaignOverview);
    spectator.detectChanges();

    component.onSortChange(mockSortChange);

    expect(spy).toHaveBeenCalled();
  });

  it('filterSelected(): should load campaigns with new filters', () => {
    component.currentFilter = 'dummy filter 1';
    const spy = jest.spyOn(component, 'quickFilterSelected');
    const newFilter = 'dummy filter 2';

    component.quickFilterSelected(newFilter);

    expect(spy).toHaveBeenCalled();
    expect(component.currentFilter).toBe(newFilter);
  });

  it('filterSelected(): should set the current filter', () => {
    component.currentFilter = 'dummy filter 1';
    const spy = jest.spyOn(component, 'quickFilterSelected');
    const sameFilter = 'dummy filter 1';

    component.quickFilterSelected(sameFilter);

    expect(spy).toHaveBeenCalled();
    expect(component.currentFilter).toBe(sameFilter);
  });

  it('toggleFilters(): should load campaigns with new filters', () => {
    component.isExpanded = true;
    const spy = jest.spyOn(component, 'toggleFilters');

    component.toggleFilters();

    expect(spy).toHaveBeenCalled();
    expect(component.isExpanded).toBe(false);
  });

  it('onEditClick(): should load campaigns with new filters', () => {
    const spy = jest.spyOn(campaignNavigationService, 'navigateToEdit');

    component.onEditClick('123');

    expect(spy).toHaveBeenCalledWith('123');
  });

  it('onPageChange(): should update pageIndex', () => {
    const tablePageEvent: TablePageEvent = {
      length: 0,
      pageIndex: 2,
      pageSize: 10,
      previousPageIndex: 1,
    };
    component.onPageChange(tablePageEvent);
    spectator.detectChanges();
    expect(component.pageIndex).toBe(2);
  });

  it('changeElementsPerPage(): should call overviewStoreService saveElementsPerPage', () => {
    const spySaveElementsPerPage = jest.spyOn(overviewStoreService, 'saveElementsPerPage');
    component.changeElementsPerPage(10);
    spectator.detectChanges();
    expect(spySaveElementsPerPage).toHaveBeenCalled();
  });

  describe('sorting', () => {
    it('should load campaigns with the sorting', () => {
      component.onSortChange(mockFieldSorting);

      expect(overviewStoreService.loadOverviewCampaign).toHaveBeenCalled();
      expect(overviewStoreService.saveSorting).toHaveBeenCalledWith(mockFieldSorting);
    });

    it('should load the campaigns with stored sorting', () => {
      const mockStoredSorting = { field: 'manufacturer', orderBy: SortingOrder.Asc };
      jest.spyOn(overviewQuery, 'sorting', 'get').mockReturnValue(mockStoredSorting);

      component.ngOnInit();

      expect(overviewStoreService.loadOverviewCampaign).toHaveBeenCalled();
    });

    it('should load the campaigns without stored sorting', () => {
      jest.spyOn(overviewQuery, 'sorting', 'get').mockReturnValue(null);

      component.ngOnInit();

      expect(overviewStoreService.loadOverviewCampaign).toHaveBeenCalled();
    });
  });

  describe('onFilterChange', () => {
    it('should set the filters and loadOverview', () => {
      component.onFilterChange();

      expect(overviewStoreService.loadOverviewCampaign).toHaveBeenCalledWith(
        0,
        undefined,
        { field: CampaignTableColumns.Code, orderBy: SortingOrder.Asc },
        [
          mockFieldPostFiltering,
          mockFieldPostFilteringManufacturer,
          mockFieldPostFilteringStatus,
          mockFieldPostFilteringStartDateFrom,
          mockFieldPostFilteringStartDateTo,
          mockFieldPostFilteringCampaignType,
        ]
      );
    });
  });
});
