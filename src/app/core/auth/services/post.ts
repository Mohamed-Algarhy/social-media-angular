import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Post {
  private readonly httpClient: HttpClient = inject(HttpClient);
  getAllPosts(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/posts`);
  }
  creatPost(postData: any): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/posts`, postData, {});
  }

  //deltpost
  deletPost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}/posts/${postId}`, {
      headers: { AUTHORIZATION: 'Bearer ' + localStorage.getItem('usertoken') },
    });
  }

  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/posts/${postId}`, {});
  }
  likePost(postId: string): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}/posts/${postId}/like`, {});
  }
}
