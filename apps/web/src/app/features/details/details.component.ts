import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostDetails } from '@orange/api-interfaces';
import { first, map, Observable, Subject, takeUntil } from 'rxjs';

import { PostsService } from '../../api';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsPageComponent implements OnInit, OnDestroy {
  post$!: Observable<PostDetails>;
  postId!: number;

  private destroy$ = new Subject<void>();

  constructor(private readonly route: ActivatedRoute, private readonly postsService: PostsService) {}

  ngOnInit(): void {
    this.route.params.pipe(map(params => Number.parseInt(params.postId))).subscribe(postId => {
      this.postId = postId;
    });

    this.loadPost();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPost(): void {
    this.post$ = this.postsService.getPost(this.postId).pipe(takeUntil(this.destroy$), first());
  }
}
