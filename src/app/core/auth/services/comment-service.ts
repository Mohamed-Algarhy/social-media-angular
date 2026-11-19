import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly httpClient = inject(HttpClient);

  getPostComments(postId: string, limit: number = 10): Observable<any> {
    return this.httpClient.get(
      `${environment.baseURL}/posts/${postId}/comments?page=1&limit=${limit}`,
    );
  }

  // createComment(postId: string, content: string): Observable<any> {
  //   return this.httpClient.post(`${environment.baseURL}/comments`, {
  //     comment: content,
  //     post: postId,
  //   });
  // }
  createComment(postId: string, content: string): Observable<any> {
    const formData = new FormData();

    formData.append('content', content);

    return this.httpClient.post(`${environment.baseURL}/posts/${postId}/comments`, formData);
  }

  deleteComment(commentId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}/comments/${commentId}`);
  }
}
