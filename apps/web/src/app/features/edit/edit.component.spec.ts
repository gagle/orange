import { ActivatedRoute } from '@angular/router';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { Post, PostDetails } from '@orange/api-interfaces';
import { of } from 'rxjs';

import { PostsService } from '../../api';
import { EditPageComponent } from './edit.component';

describe('EditPageComponent', () => {
  let spectator: Spectator<EditPageComponent>;
  let component: EditPageComponent;
  let postsService: PostsService;

  const postsServiceStub: Partial<PostsService> = {
    updatePost: jest.fn(() => of({} as Post)),
    getPost: jest.fn(() => of({ id: 1, title: 'title', body: 'body', user: { id: 2 } } as PostDetails)),
  };

  const activatedRouteStub: Partial<ActivatedRoute> = {
    params: of({ postId: '1' }),
  };

  const createComponent = createComponentFactory({
    component: EditPageComponent,
    providers: [mockProvider(PostsService, postsServiceStub), mockProvider(ActivatedRoute, activatedRouteStub)],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    postsService = spectator.inject(PostsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load the post', () => {
      const postId = 1;
      expect(postsService.getPost).toHaveBeenCalledTimes(1);
      expect(postsService.getPost).toHaveBeenCalledWith(postId);
    });
  });

  describe('submitEditPost', () => {
    it('should update the post', () => {
      component.submitEditPost();

      expect(postsService.updatePost).toHaveBeenCalledTimes(1);
      expect(postsService.updatePost).toHaveBeenCalledWith({
        id: 1,
        userId: 2,
        body: 'body',
        title: 'title',
      } as Post);
    });
  });
});
