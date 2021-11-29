import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, PostDetails } from '@orange/api-interfaces';
import { Observable } from 'rxjs';

import { apiUrl } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${apiUrl}/posts`);
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
