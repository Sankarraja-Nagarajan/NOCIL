import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { VendorService } from "../../../../Services/vendor.service";
import { CommonService } from "../../../../Services/common.service";
import { VendorMaster } from "../../../../Models/Dtos";
import { Router } from "@angular/router";
import { setSession } from "../../../../Utils";
import { MasterService } from "../../../../Services/master.service";

@Component({
  selector: "ngx-vendor-list",
  templateUrl: "./vendor-list.component.html",
  styleUrls: ["./vendor-list.component.scss"],
})
export class VendorListComponent implements OnInit, OnChanges {
  @Input() vendorType: string;
  @Input() searchText: string;
  @Input() vendors: VendorMaster[] = []; 

  displayedColumns: string[] = [
    "Vendor_Name",
    "Vendor_Mail",
    "Vendor_Mobile",
    "Vendor_Code",
    "Vendor_Type",
    "view",
  ];
  dataSource = new MatTableDataSource<VendorMaster>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _vendor: VendorService,
    private _common: CommonService,
    private _router: Router,
    private _master: MasterService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.vendorType) {
      if (this.vendorType == "ISO Vendors") this.getVendors(true);
      if (this.vendorType == "Non-ISO Vendors") this.getVendors(false);
      if (this.vendorType == "Transport Vendors") this.getTransportVendors();
    }

    if (changes.searchText) {
      this.dataSource.filter = this.searchText.trim().toLowerCase();
    }

    if(changes.vendors){
      this.dataSource = new MatTableDataSource(changes.vendors.currentValue);
      this.dataSource.paginator = this.paginator;
    }
  }

  filterTableData(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getVendors(type: boolean) {
    
    this._vendor.getVendorsByType(type).subscribe({
      next: (res) => {
        if (res) {
          this.dataSource.data = res as VendorMaster[];
          this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator;
          
        }
      },
      error: (err) => {
        
      },
    });
  }

  getTransportVendors() {
    
    this._vendor.getAllTransportVendors().subscribe({
      next: (res) => {
        if (res) {
          this.dataSource.data = res as VendorMaster[];
          this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator;
          
        }
      },
      error: (err) => {
        
      },
    });
  }

  preview(i: number) {
    const x = this.paginator.pageIndex;
    const y = this.paginator.pageSize;
    i = i + x*y;
    let formInfo = {
      FormId: this.dataSource.data[i].Form_Id,
      VT_Id: this.dataSource.data[i].VT_Id,
      Vendor_Type : this.dataSource.data[i].Vendor_Type,
      Vendor_Code: this.dataSource.data[i].Vendor_Code
    };
    setSession("vendorInfo", JSON.stringify(formInfo));

    //this.getVendorProfile(this.dataSource.data[i].Form_Id);

    this._router.navigate(["/profile/"]);
  }

  getVendorProfile(formId: number){
    this._master.getVendorProfile(formId).subscribe({
      next: (res)=>{
        console.log("Vendor Profile: ",res);
      },
      error:(err)=> {console.log(err)}
    });
  }
}
