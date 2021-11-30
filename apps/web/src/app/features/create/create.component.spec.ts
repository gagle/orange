import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { Post } from '@orange/api-interfaces';
import { of } from 'rxjs';

import { PostsService } from '../../api';
import { CreatePageComponent } from './create.component';

describe('CreatePageComponent', () => {
  let spectator: Spectator<CreatePageComponent>;
  let component: CreatePageComponent;
  let postsService: PostsService;

  const postsServiceStub: Partial<PostsService> = {
    createPost: jest.fn(() => of({} as Post)),
  };

  const createComponent = createComponentFactory({
    component: CreatePageComponent,
    providers: [mockProvider(PostsService, postsServiceStub)],
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

  describe('submitCreatePost', () => {
    it('should create the post', () => {
      component.formGroup.controls.userId.setValue(1);
      component.formGroup.controls.title.setValue('title');
      component.formGroup.controls.body.setValue('body');

      component.submitCreatePost();

      expect(postsService.createPost).toHaveBeenCalledTimes(1);
      expect(postsService.createPost).toHaveBeenCalledWith({
        userId: 1,
        title: 'title',
        body: 'body',
      } as Post);
    });
  });
});
