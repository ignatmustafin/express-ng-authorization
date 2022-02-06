import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ILogIn, User } from './../../../shared/interfaces';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null;

  constructor(private http: HttpClient) {
    
  }

  isAuthenticated() {
    return true;
  }

  login(user: User): Observable<ILogIn> {
    return this.http.post<ILogIn>('/api/auth/signIn', user);
  }

  getToken() {
    
  }

  
}
