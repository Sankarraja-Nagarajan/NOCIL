import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/internal/Observable';
import { Approval, Form, FormSubmitTemplate, Rejection } from '../Models/Registration';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  baseURL: string = 'https://localhost:44300/api';

  constructor(private _http: HttpService) { }

  // Initiate form
  formInitiate(form: Form): Observable<any> {
    const URL = `${this.baseURL}/Registration/Initiate`;
    return this._http.post(URL, form);
  }

  // Form submission
  formSubmit(form: FormSubmitTemplate): Observable<any> {
    const URL = `${this.baseURL}/Registration/Submit`;
    return this._http.post(URL, form);
  }

  // Form approval
  formApproval(approval: Approval): Observable<any> {
    const URL = `${this.baseURL}/Registration/Approve`;
    return this._http.post(URL, approval);
  }

  // Form rejection
  formRejection(rejection: Rejection): Observable<any> {
    const URL = `${this.baseURL}/Registration/Reject`;
    return this._http.post(URL, rejection);
  }

  // Get Form data by form Id
  getFormData(formId: number, tableName: string): Observable<any> {
    const URL = `${this.baseURL}/GetFormData/GetFormData?formId=${formId}&tableName=${tableName}`;
    return this._http.get(URL);
  }
}