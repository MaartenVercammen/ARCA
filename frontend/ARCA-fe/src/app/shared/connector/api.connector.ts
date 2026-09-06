import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiConnector {
  private _http = inject(HttpClient);
  private _environment = environment;

  protected basePath: string = "";

  public get<O>(path: string): Observable<O> {
    return this._http.get<O>(this._environment.apiUrl + this.basePath + path);
  }

  public post<I, O>(path: string, input: I): Observable<O> {
    return this._http.post<O>(this._environment.apiUrl + this.basePath + path, input);
  }

}
