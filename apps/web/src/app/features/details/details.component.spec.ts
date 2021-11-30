import { ActivatedRoute } from '@angular/router';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { PostDetails } from '@orange/api-interfaces';
import { of } from 'rxjs';

import { PostsService } from '../../api';
import { DetailsPageComponent } from './details.component';

describe('DetailsPageComponent', () => {
  let spectator: Spectator<DetailsPageComponent>;
  let component: DetailsPageComponent;
  let postsService: PostsService;

  const postStub = {
    id: 1,
    title: 'title',
    body: 'body',
    user: {
      id: 2,
      address: {
        street: 'street',
      },
      company: {
        name: 'name',
      },
    },
    comments: [
      {
        name: 'name',
      },
    ],
  } as PostDetails;

  const postsServiceStub: Partial<PostsService> = {
    getPost: jest.fn(() => of(postStub)),
  };

  const activatedRouteStub: Partial<ActivatedRoute> = {
    params: of({ postId: '1' }),
  };

  const createComponent = createComponentFactory({
    component: DetailsPageComponent,
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
});
