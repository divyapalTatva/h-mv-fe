import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) { }

  private buildHeaders(showLoader: boolean): HttpHeaders {
    let headers = new HttpHeaders();
    if (!showLoader) {
      headers = headers.set('X-Skip-Loader', 'true');
    }
    return headers;
  }

  get<T>(url: string, params?: HttpParams, showLoader: boolean = true): Observable<T> {
    const headers = this.buildHeaders(showLoader);
    return this.http.get<T>(url, { params, headers });
  }

  post<T>(url: string, body?: any, showLoader: boolean = true): Observable<T> {
    const headers = this.buildHeaders(showLoader);
    return this.http.post<T>(url, body, { headers });
  }

  put<T>(url: string, body: any, showLoader: boolean = true): Observable<T> {
    const headers = this.buildHeaders(showLoader);
    return this.http.put<T>(url, body, { headers });
  }

  delete<T>(url: string, body?: any, showLoader: boolean = true): Observable<T> {
    const headers = this.buildHeaders(showLoader);
    const options = { headers, body };
    return this.http.delete<T>(url, options);
  }

  patch<T>(url: string, body: any, showLoader: boolean = true): Observable<T> {
    const headers = this.buildHeaders(showLoader);
    return this.http.patch<T>(url, body, { headers });
  }

  downloadFile(url: string, showLoader: boolean = true) : Observable<Blob> {
    const headers = this.buildHeaders(showLoader);

    return this.http.get(url, {
      headers,
      responseType: 'blob' as 'blob' // IMPORTANT
    });
  }

}
