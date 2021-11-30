import { SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { Post } from '@orange/api-interfaces';
import { of } from 'rxjs';

import { OverviewStoreService } from '../../store/overview.store.service';
import { PostsTableComponent } from './posts-table.component';

describe('PostsTableComponent', () => {
  let spectator: Spectator<PostsTableComponent>;
  let component: PostsTableComponent;
  let overviewStoreService: OverviewStoreService;
  let router: Router;

  const overviewStoreServiceStub: Partial<OverviewStoreService> = {
    loadPosts: jest.fn(() => of([{ id: 1 }] as Post[])),
    posts$: of([{ id: 1 }] as Post[]),
  };

  const routerStub: Partial<Router> = {
    navigate: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: PostsTableComponent,
    providers: [mockProvider(OverviewStoreService, overviewStoreServiceStub), mockProvider(Router, routerStub)],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    overviewStoreService = spectator.inject(OverviewStoreService);
    router = spectator.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load posts', () => {
      expect(overviewStoreService.loadPosts).toHaveBeenCalledTimes(1);
      expect(overviewStoreService.loadPosts).toHaveBeenCalledWith('');
    });
  });

  describe('userId changes', () => {
    it('should load posts when userId changes', () => {
      const userId = '2';
      component.ngOnChanges({ userId: new SimpleChange(null, userId, true) });

      expect(overviewStoreService.loadPosts).toHaveBeenCalledTimes(2);
      expect((overviewStoreService.loadPosts as jest.Mock).mock.calls[1]).toEqual([userId]);
    });
  });

  describe('onEditPost', () => {
    it('should navigate to edit page', () => {
      component.onEditPost({ id: 1 } as Post);

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/edit', 1]);
    });
  });

  describe('onDetailsPost', () => {
    it('should navigate to details page', () => {
      component.onDetailsPost({ id: 1 } as Post);

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/details', 1]);
    });
  });
});
