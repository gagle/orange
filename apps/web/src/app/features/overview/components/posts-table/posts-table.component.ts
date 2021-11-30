import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '@orange/api-interfaces';
import { BehaviorSubject, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { PostsTableColumns } from '../../enums/posts-table-columns.enum';
import { OverviewStoreService } from '../../store/overview.store.service';

@Component({
  selector: 'app-posts-table',
  templateUrl: './posts-table.component.html',
  styleUrls: ['./posts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsTableComponent implements OnInit, OnDestroy, OnChanges {
  PostsTableColumns = PostsTableColumns;
  tableColumns = Object.values(PostsTableColumns);

  posts$ = this.overviewStoreService.posts$;

  @Input() userId!: string;

  private destroy$ = new Subject<void>();
  private userId$ = new BehaviorSubject<string>('');

  constructor(private overviewStoreService: OverviewStoreService, private router: Router) {}

  ngOnInit(): void {
    this.userId$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(userId => this.overviewStoreService.loadPosts(userId))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userId) {
      this.onUserIdChange(changes.userId.currentValue);
    }
  }

  onEditPost(post: Post): void {
    this.router.navigate(['/edit', post.id]);
  }

  onDetailsPost(post: Post): void {
    this.router.navigate(['/details', post.id]);
  }

  private onUserIdChange(userId: string): void {
    this.userId$.next(userId);
  }
}
