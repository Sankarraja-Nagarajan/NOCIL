import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  baseURL: string = environment.baseURL;

  constructor(private _http: HttpService) { }

  getVendorsByType(type:boolean): Observable<any> {
    const URL = `${this.baseURL}/Vendors/GetAllVendorsByType?type=${type}`;
    return this._http.get(URL);
  }

  getAllTransportVendors(): Observable<any> {
    const URL = `${this.baseURL}/Vendors/GetAllTransportVendors`;
    return this._http.get(URL);
  }
}
