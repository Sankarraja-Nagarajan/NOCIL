/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { NbIconLibraries, NbMenuItem } from "@nebular/theme";
// import { Sample } from "./Pages/pages-menu";
import { Sample } from "./pages/pages-menu";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  menu: NbMenuItem[] = [];
  _sample = new Sample();

  constructor(
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this._router.events.subscribe({
      next:(res)=>{
        this.menu = this._sample.getMenuItems();
      }
    });
    
  }
}
