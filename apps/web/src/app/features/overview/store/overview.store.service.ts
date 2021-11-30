import { Injectable } from '@angular/core';
import { Post } from '@orange/api-interfaces';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';

import { PostsService } from '../../../api/services/posts/posts.service';

/**
 * In memory redux-like store without error handling.
 */
@Injectable({
  providedIn: 'root',
})
export class OverviewStoreService {
  private postsSubject$ = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject$.asObservable();

  constructor(private readonly postsService: PostsService) {}

  loadPosts(userId: string): Observable<Post[]> {
    return this.postsService.getPosts(userId).pipe(
      first(),
      tap(posts => {
        this.postsSubject$.next(posts);
      }),
      catchError((error: Error) => {
        // Do something with the error
        return throwError(() => error);
      })
    );
  }
}
