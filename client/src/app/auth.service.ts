import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuthHttp, tokenNotExpired } from 'angular2-jwt';

import { User } from './user';

@Injectable()
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/';

  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  private user: User;
  private token: string = '';

  constructor(
    private authHttp: AuthHttp,
    private http: Http
  ) { }

  set authUser(user:User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  get authUser(): User {
    return this.user;
  }

  set authToken(token:string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  get authToken(): string {
    return this.token;
  }

  getRegister(newUser: User): Promise<any> {
    return this.http
      .post(`${this.apiUrl}register/`, JSON.stringify(newUser), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getAuthenticate(username, password): Promise<any> {
    return this.http
      .post(`${this.apiUrl}auth/`,
        JSON.stringify({username: username, password: password}),
        {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  isLoggedIn(): boolean {
    return tokenNotExpired();
  }

  getProfile(): Promise<any> {
    return this.authHttp
      .get(`${this.apiUrl}profile/`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getLogout(): void {
    this.token = undefined;
    this.user = undefined;
    localStorage.clear();
  }

  private handleError(error: any): Promise<any> {
    if (error.status === 401) {
      return Promise.resolve({succes:false, msg: "Unathorized" });
    }
    if (error.status === 404)
      return Promise.resolve({succes:false, msg: "Not found" });
    else {
      console.error('An error occurred', error);
      return Promise.reject(error.message || error);
    }
  }

}
