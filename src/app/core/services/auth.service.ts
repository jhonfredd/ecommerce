import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse, CambiarPasswordPayload, Dasboard, DasboardRegisterPayloade, DasboardUpdate, LoginPayload, RegisterPayload, UpdateStatus, User } from '../models/common.model';
import { ApiEndpoint, LocalStorage } from '../constants/constants';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggeIn = signal<boolean>(false); //declaramos si esta logeado o no
  router = inject(Router);//inyectamos la rutas de angular

  constructor(private _http:HttpClient) {
    if(this.getUserToken()){
      this.isLoggeIn.update(()=>true);
    }
  }

  register(payload: RegisterPayload){
    return this._http.post<ApiResponse<User>>(`
      ${ApiEndpoint.Auth.Register}`,
      payload
    )
  }

  cambiarPassword(payload: CambiarPasswordPayload){
    return this._http.post<ApiResponse<User>>(`
      ${ApiEndpoint.Auth.CambioPassword}`, //CambioPassword lleva a constants.ts para traer la ruta
      payload
    )
  }

  login(payload: LoginPayload): Observable<any>{
    return this._http.post<ApiResponse<User>>(`
      ${ApiEndpoint.Auth.Login}`,
      payload
    ).pipe(map((response)=>{
      if(response.status && response.token){
        localStorage.setItem(LocalStorage.token, response.token);
        this.isLoggeIn.update(()=>true);
      }
      return response;
    }));
  }
  
  me(){
    return this._http.get<ApiResponse<User>>(`
      ${ApiEndpoint.Auth.Me}`,
    )
  }  

  getUserToken(){
    return localStorage.getItem(LocalStorage.token);
  }

  logout(){
    localStorage.removeItem(LocalStorage.token);
    this.isLoggeIn.update(() => false);
    this.router.navigate(['login']);
  }
  //dasboard
    getDasboard(){
      return this._http.get<ApiResponse<Dasboard>>(`
        ${ApiEndpoint.Auth.getDasboards}`,
      )
    }

    registerDasboard(payload: DasboardRegisterPayloade){
      return this._http.post<ApiResponse<DasboardRegisterPayloade>>(`
        ${ApiEndpoint.Auth.RegisterDasboards}`,
        payload
      )
    }

    updateDasboard (payload: DasboardUpdate): Observable<any>  {
      return this._http.post<ApiResponse<DasboardUpdate>>(
        `${ApiEndpoint.Auth.updateDasboards}`,
        payload
      );
    }
  
    cambiarEstadoDasboard(payload: UpdateStatus) {
      return this._http.post<ApiResponse<UpdateStatus>>(
        `${ApiEndpoint.Auth.updateStatusDasboards}`,
        payload
      );
    }


  //fin dasboard
}
