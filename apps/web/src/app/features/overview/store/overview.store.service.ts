import { Injectable } from '@angular/core';
import { Post } from '@orange/api-interfaces';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';

import { PostService } from '../../../api/services/post/post.service';

/**
 * In memory redux-like store without error handling
 */
@Injectable({
  providedIn: 'root',
})
export class OverviewStoreService {
  private postsSubject$ = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject$.asObservable();

  constructor(private readonly postsService: PostService) {}

  loadPosts(userId: string): Observable<Post[]> {
    return this.postsService.getPosts(userId).pipe(
      first(),
      tap(posts => {
        this.postsSubject$.next(posts);
      }),
      catchError((error: Error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }
}
