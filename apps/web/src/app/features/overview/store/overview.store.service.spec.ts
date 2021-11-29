import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator/jest';
import { of, throwError } from 'rxjs';

import { SortingOrder } from '@/api';
import { mockSortChange } from '@/api/mocks';
import { mockPage } from '@/api/mocks/page.mock';
import { CampaignOverview, FieldSorting, Page } from '@/api/models';
import { OverviewService } from '@/api/services/overview/overview.service';
import { OverviewStore } from '@/features/overview/store/overview.store';
import { OverviewStoreService } from '@/features/overview/store/overview.store.service';

describe('OverviewStoreService', () => {
  let spectator: SpectatorService<OverviewStoreService>;
  let store: OverviewStore;
  let service: OverviewStoreService;
  let setLoadingSpy: jest.SpyInstance;
  let overviewService: OverviewService;
  const overviewServiceStub: Partial<OverviewService> = {
    getCampaigns: () => of(mockPage as Page<CampaignOverview>),
  };
  const createService = createServiceFactory({
    service: OverviewStoreService,
    providers: [OverviewStore, mockProvider(OverviewService, overviewServiceStub)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    overviewService = spectator.inject(OverviewService);
    store = spectator.inject(OverviewStore);
    setLoadingSpy = jest.spyOn(store, 'setLoading');
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('loadOverviewCampaign', () => {
    let updateSpy: jest.SpyInstance;
    beforeEach(() => {
      updateSpy = jest.spyOn(store, 'update');
    });

    it('should fetch the campaigns', () => {
      const createCampaignSpy = jest.spyOn(overviewService, 'getCampaigns');

      service.loadOverviewCampaign(1, 10, mockSortChange);

      expect(createCampaignSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalled();
      expect(setLoadingSpy).toHaveBeenLastCalledWith(false);
    });

    it('should return error if there are no campaigns', () => {
      jest.spyOn(overviewService, 'getCampaigns').mockReturnValueOnce(throwError({ error: true }));

      service.loadOverviewCampaign(1, 10, mockSortChange);

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('saveSorting', () => {
    it('should save the sorting', () => {
      store.update = jest.fn();

      const sorting: FieldSorting = {
        field: 'field',
        orderBy: SortingOrder.Asc,
      };

      spectator.service.saveSorting(sorting);

      expect(store.update).toHaveBeenCalledTimes(1);
      expect(store.update).toHaveBeenCalledWith({ sorting });
    });
  });

  describe('saveElementsPerPage', () => {
    it('should save the elementsPerPage', () => {
      store.update = jest.fn();
      const elementsPerPage = 20;

      spectator.service.saveElementsPerPage(elementsPerPage);

      expect(store.update).toHaveBeenCalledTimes(1);
      expect(store.update).toHaveBeenCalledWith({ elementsPerPage });
    });
  });
});
