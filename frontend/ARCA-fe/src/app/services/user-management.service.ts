import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import {parse} from 'vite';


export type User = {
  username: string;
  roles: string[]
}

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {

  private _http = inject(HttpClient);

  public users = signal<User[]>([]);

  public async fetchUsers() {
    return await new Promise((resolve, reject) => {
      this._http.get<User[]>("http://localhost:8080/users", {headers: {Authorization: "Bearer " + sessionStorage.getItem("accessToken")}})
        .subscribe({
          next: (response: User[]) => {
            this.users.set(response);
            resolve(true);
          },
          error: (err) => {
            console.error(err);
            resolve(false);
          }
        });
    });
  }

}
