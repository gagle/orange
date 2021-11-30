import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, PostDetails } from '@orange/api-interfaces';
import { Observable } from 'rxjs';

import { apiUrl } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  getPosts(userId = ''): Observable<Post[]> {
    let params = new HttpParams();
    if (userId) {
      params = params.append('userId', userId);
    }
    return this.http.get<Post[]>(`${apiUrl}/posts`, { params });
  }

  getPost(postId: number): Observable<PostDetails> {
    return this.http.get<PostDetails>(`${apiUrl}/posts/${postId}`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${apiUrl}/post`, post);
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${apiUrl}/post`, post);
  }
}
