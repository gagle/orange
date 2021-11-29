import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Recall2ButtonTertiaryComponent, ToastService } from '@recall2/frontend-core';
import { SVGIconComponent } from '@recall2/icons';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of, Subject } from 'rxjs';

import { TableSortingOrder } from '@/api';
import { Criterion, CriterionMaterial, FieldSorting } from '@/api/models';
import { CommonModalService, TableHeaderComponent, TableSortDirective } from '@/shared';
import { TablePageEvent } from '@/shared/models/table-page-event.model';

import { CriterionQuery } from '../../store/criterion.query';
import { CriterionMaterialsQuery } from '../../store/criterion-materials.query';
import { CriterionMaterialsStore } from '../../store/criterion-materials.store';
import { CriterionMaterialsStoreService } from '../../store/criterion-materials.store.service';
import { TableRow } from '../../utils/table-form';
import { CriterionTablePaginatorComponent } from '../criterion-table-paginator/criterion-table-paginator.component';
import { CriterionMaterialsTableComponent } from './posts-table.component';

describe('CriterionMaterialsTableComponent', () => {
  let spectator: Spectator<CriterionMaterialsTableComponent>;
  let component: CriterionMaterialsTableComponent;
  let criterionMaterialsStoreService: CriterionMaterialsStoreService;
  let modalService: CommonModalService;
  let criterionMaterialsStore: CriterionMaterialsStore;
  let toastService: ToastService;

  const defaultSorting: FieldSorting = {
    field: 'field',
    orderBy: TableSortingOrder.Asc,
  };

  const criterionQueryStub: Partial<CriterionQuery> = {
    criterion$: of({
      id: 'criterionId',
    } as Criterion),
  };

  const material: CriterionMaterial = {
    partNumber: 'partNumber',
    description: 'description',
    comment: 'comment',
    amount: 1,
    affected: 1,
  };

  const criterionMaterialsStoreServiceStub: Partial<CriterionMaterialsStoreService> = {
    loadMaterials: jest.fn(() => of([] as CriterionMaterial[])),
    addMaterial: jest.fn(() => of(material)),
    updateMaterial: jest.fn(() => of(material)),
    saveSorting: jest.fn(),
  };

  const criterionMaterialsQueryStub: Partial<CriterionMaterialsQuery> = {
    totalElements$: of(0),
    materials$: of([]),
  };

  const routerQueryStub: Partial<RouterQuery> = {
    getParams: <T extends unknown>(): T => ({ campaignId: 'campaignId' } as T),
  };

  const toastServiceStub: Partial<ToastService> = {
    success: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: CriterionMaterialsTableComponent,
    imports: [MatTableModule],
    providers: [
      mockProvider(CriterionQuery, criterionQueryStub),
      mockProvider(CriterionMaterialsStoreService, criterionMaterialsStoreServiceStub),
      mockProvider(CriterionMaterialsQuery, criterionMaterialsQueryStub),
      mockProvider(CriterionMaterialsStore, {}),
      mockProvider(RouterQuery, routerQueryStub),
      mockProvider(CommonModalService),
      mockProvider(TranslateService),
      mockProvider(ToastService, toastServiceStub),
    ],
    declarations: [
      MockPipe(TranslatePipe),
      MockComponent(TableHeaderComponent),
      MockComponent(SVGIconComponent),
      MockComponent(Recall2ButtonTertiaryComponent),
      MockComponent(CriterionTablePaginatorComponent),
      MockDirective(TableSortDirective),
    ],
    detectChanges: false,
  });

  const addMaterial$ = new Subject<void>();

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    component.addMaterial$ = addMaterial$.asObservable();
    criterionMaterialsStoreService = spectator.inject(CriterionMaterialsStoreService);
    modalService = spectator.inject(CommonModalService);
    toastService = spectator.inject(ToastService);
    criterionMaterialsStore = spectator.inject(CriterionMaterialsStore);

    component.sorting$ = of(defaultSorting);

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the store on destroy', () => {
    criterionMaterialsStore.reset = jest.fn();

    component.ngOnDestroy();

    expect(criterionMaterialsStore.reset).toHaveBeenCalledTimes(1);
  });

  it('should switch from normal row to form row on click on edit button', () => {
    const row: TableRow<CriterionMaterial> = {
      isFormRow: false,
    };

    const spyRenderRows = jest.spyOn(component.materialsTable, 'renderRows');

    component.onEditMaterial(row);

    expect(row.isFormRow).toEqual(true);
    expect(spyRenderRows).toHaveBeenCalledTimes(1);
  });

  describe('add material', () => {
    it('should add a form row when adding a material', () => {
      component.materialRows = [];

      addMaterial$.next();

      expect(component.materialRows).toEqual([{ isFormRow: true }]);
      expect(component.totalElements).toEqual(0);
    });
  });

  describe('onUpdateMaterialRow', () => {
    describe('add row', () => {
      it('should remove the new form row when form is canceled', () => {
        const formRow: TableRow<CriterionMaterial> = { isFormRow: true };
        const row = { item: {} } as TableRow<CriterionMaterial>;
        component.materialRows = [formRow, row];

        const spyRender = jest.spyOn(component.materialsTable, 'renderRows');

        component.onCancelMaterialRow(formRow);

        expect(component.materialRows).toEqual([row]);
        expect(spyRender).toHaveBeenCalledTimes(1);
      });

      it('should add and load materials when the form is fulfilled', () => {
        const formRow: TableRow<CriterionMaterial> = { isFormRow: true };
        const row = { item: {} } as TableRow<CriterionMaterial>;
        component.pageSize = 1;
        component.materialRows = [formRow, row];

        component.onUpdateMaterialRow({ item: material } as TableRow<CriterionMaterial>);

        expect(component.materialRows).toEqual([formRow, row]);
        expect(criterionMaterialsStoreService.addMaterial).toHaveBeenCalledTimes(1);
        expect(criterionMaterialsStoreService.addMaterial).toHaveBeenCalledWith('campaignId', 'criterionId', material);
        expect(criterionMaterialsStoreService.loadMaterials).toHaveBeenCalledTimes(2);
        expect((criterionMaterialsStoreService.loadMaterials as jest.Mock).mock.calls[1]).toEqual([
          'campaignId',
          'criterionId',
          {
            page: 0,
            pageSize: 1,
            sort: defaultSorting,
          },
        ]);
        expect(toastService.success).toHaveBeenCalledTimes(1);
      });
    });

    describe('edit row', () => {
      it('should switch from form row to the normal when form is canceled', () => {
        const row = { item: {}, isFormRow: true } as TableRow<CriterionMaterial>;
        component.materialRows = [row];

        const spyRender = jest.spyOn(component.materialsTable, 'renderRows');

        component.onCancelMaterialRow(row);

        expect(component.materialRows).toEqual([{ item: {}, isFormRow: false } as TableRow<CriterionMaterial>]);
        expect(spyRender).toHaveBeenCalledTimes(1);
      });

      it('should update and load materials when the form is fulfilled', () => {
        const formRow: TableRow<CriterionMaterial> = { item: {}, isFormRow: true } as TableRow<CriterionMaterial>;
        const row = { item: {} } as TableRow<CriterionMaterial>;
        component.pageSize = 1;
        component.materialRows = [formRow, row];

        component.onUpdateMaterialRow({ item: material } as TableRow<CriterionMaterial>);

        expect(component.materialRows).toEqual([formRow, row]);
        expect(criterionMaterialsStoreService.updateMaterial).toHaveBeenCalledTimes(1);
        expect(criterionMaterialsStoreService.updateMaterial).toHaveBeenCalledWith(
          'campaignId',
          'criterionId',
          material
        );
        expect(criterionMaterialsStoreService.loadMaterials).toHaveBeenCalledTimes(2);
        expect((criterionMaterialsStoreService.loadMaterials as jest.Mock).mock.calls[1]).toEqual([
          'campaignId',
          'criterionId',
          {
            page: 0,
            pageSize: 1,
            sort: defaultSorting,
          },
        ]);
      });
    });

    describe('pagination', () => {
      it('should update the page index on page change', () => {
        component.pageIndex = 2;

        component.onPageChange({ pageIndex: 1 } as TablePageEvent);

        expect(component.pageIndex).toEqual(1);
      });

      it('should load materials on init', () => {
        expect(criterionMaterialsStoreService.loadMaterials).toHaveBeenCalledTimes(1);
        expect(criterionMaterialsStoreService.loadMaterials).toHaveBeenCalledWith('campaignId', 'criterionId', {
          page: 0,
          pageSize: 8,
          sort: defaultSorting,
        });
      });

      it('should load materials on page change', () => {
        component.pageIndex = 2;

        component.onPageChange({ pageIndex: 1 } as TablePageEvent);

        expect(criterionMaterialsStoreService.loadMaterials).toHaveBeenCalledTimes(2);
        expect((criterionMaterialsStoreService.loadMaterials as jest.Mock).mock.calls[1]).toEqual([
          'campaignId',
          'criterionId',
          {
            page: 1,
            pageSize: 8,
            sort: defaultSorting,
          },
        ]);
      });
    });

    describe('sorting', () => {
      it('should load materials with the sorting', () => {
        const sorting: FieldSorting = {
          field: 'field',
          orderBy: TableSortingOrder.Desc,
        };
        component.onSortChange(sorting);

        expect(criterionMaterialsStoreService.loadMaterials).toHaveBeenCalledTimes(2);
        expect((criterionMaterialsStoreService.loadMaterials as jest.Mock).mock.calls[1]).toEqual([
          'campaignId',
          'criterionId',
          {
            page: 0,
            pageSize: 8,
            sort: defaultSorting,
          },
        ]);
        expect(criterionMaterialsStoreService.saveSorting).toHaveBeenCalledTimes(1);
        expect(criterionMaterialsStoreService.saveSorting).toHaveBeenCalledWith(sorting);
      });
    });
  });

  describe('onDelete', () => {
    it('should delete and load materials on accept modal', () => {
      const row1 = { item: { id: 'materialId1' } } as TableRow<CriterionMaterial>;
      const row2 = { item: { id: 'materialId2' } } as TableRow<CriterionMaterial>;
      component.materialRows = [row1, row2];

      const modalMock = {
        afterClosed: () => of(true),
      } as MatDialogRef<MatDialogConfig>;

      const openModalSpy = jest.spyOn(modalService, 'open').mockReturnValueOnce(modalMock);
      criterionMaterialsStoreService.deleteMaterial = jest.fn(() => of(null));

      component.onDeleteMaterial(row1);

      expect(openModalSpy).toHaveBeenCalled();
      expect(criterionMaterialsStoreService.deleteMaterial).toHaveBeenCalledTimes(1);
      expect(criterionMaterialsStoreService.deleteMaterial).toHaveBeenCalledWith(
        'campaignId',
        'criterionId',
        'materialId1'
      );
      expect(criterionMaterialsStoreService.loadMaterials).toHaveBeenCalledTimes(2);
      expect((criterionMaterialsStoreService.loadMaterials as jest.Mock).mock.calls[1]).toEqual([
        'campaignId',
        'criterionId',
        {
          page: 0,
          pageSize: 8,
          sort: defaultSorting,
        },
      ]);
    });

    it('should delete and load the previous page when the last material in the page has been deleted', () => {
      const row1 = { item: { id: 'materialId1' } } as TableRow<CriterionMaterial>;
      component.materialRows = [row1];
      component.pageIndex = 1;

      const modalMock = {
        afterClosed: () => of(true),
      } as MatDialogRef<MatDialogConfig>;

      const openModalSpy = jest.spyOn(modalService, 'open').mockReturnValueOnce(modalMock);
      criterionMaterialsStoreService.deleteMaterial = jest.fn(() => of(null));

      component.onDeleteMaterial(row1);

      expect(openModalSpy).toHaveBeenCalled();
      expect(criterionMaterialsStoreService.deleteMaterial).toHaveBeenCalledTimes(1);
      expect(criterionMaterialsStoreService.deleteMaterial).toHaveBeenCalledWith(
        'campaignId',
        'criterionId',
        'materialId1'
      );
      expect(criterionMaterialsStoreService.loadMaterials).toHaveBeenCalledTimes(2);
      expect((criterionMaterialsStoreService.loadMaterials as jest.Mock).mock.calls[1]).toEqual([
        'campaignId',
        'criterionId',
        {
          page: 0,
          pageSize: 8,
          sort: defaultSorting,
        },
      ]);
    });

    it('should delete and load the first page when the last material in the page has been deleted', () => {
      const row1 = { item: { id: 'materialId1' } } as TableRow<CriterionMaterial>;
      component.materialRows = [row1];
      component.pageIndex = 0;

      const modalMock = {
        afterClosed: () => of(true),
      } as MatDialogRef<MatDialogConfig>;

      const openModalSpy = jest.spyOn(modalService, 'open').mockReturnValueOnce(modalMock);
      criterionMaterialsStoreService.deleteMaterial = jest.fn(() => of(null));

      component.onDeleteMaterial(row1);

      expect(openModalSpy).toHaveBeenCalled();
      expect(criterionMaterialsStoreService.deleteMaterial).toHaveBeenCalledTimes(1);
      expect(criterionMaterialsStoreService.deleteMaterial).toHaveBeenCalledWith(
        'campaignId',
        'criterionId',
        'materialId1'
      );
      expect(criterionMaterialsStoreService.loadMaterials).toHaveBeenCalledTimes(2);
      expect((criterionMaterialsStoreService.loadMaterials as jest.Mock).mock.calls[1]).toEqual([
        'campaignId',
        'criterionId',
        {
          page: 0,
          pageSize: 8,
          sort: defaultSorting,
        },
      ]);
    });

    it('should not delete on cancel modal', () => {
      const materialRow = { item: { id: 'materialId' } } as TableRow<CriterionMaterial>;

      const modalMock = {
        afterClosed: () => of(false),
      } as MatDialogRef<MatDialogConfig>;

      const openModalSpy = jest.spyOn(modalService, 'open').mockReturnValueOnce(modalMock);
      const deleteMaterialSpy = jest.spyOn(criterionMaterialsStoreService, 'deleteMaterial');

      component.onDeleteMaterial(materialRow);

      expect(openModalSpy).toHaveBeenCalled();
      expect(deleteMaterialSpy).not.toHaveBeenCalled();
    });
  });
});
