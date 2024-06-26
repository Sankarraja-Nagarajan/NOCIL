import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  private appConfig: any;

  constructor(private http: HttpClient) {}

  loadAppConfig() {
    return this.http
      .get("../../assets/configuration/config.json")
      .toPromise()
      .then((data) => {
        this.appConfig = data;
      });
  }

  get(key): any {
    return this.appConfig[key];
  }

  getSubItem(key: string, subKey: string){
    return this.appConfig[key]?.[subKey];
  }

  updateConfigValue(key: string, value: any): void {
    if (this.appConfig) {
      this.appConfig[key] = value;
    } else {
      console.error("Config not loaded yet.");
    }
  }
}
