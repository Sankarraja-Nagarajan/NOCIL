import { Component, Input, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { LoginService } from "../../../Services/login.service";
import { VendorBranch } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { RegistrationService } from "../../../Services/registration.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";

@Component({
  selector: "ngx-vendor-branches",
  templateUrl: "./vendor-branches.component.html",
  styleUrls: ["./vendor-branches.component.scss"],
})
export class VendorBranchesComponent implements OnInit {
  @Input() form_Id: number;

  isVendorBranchRequired: FormControl = new FormControl(true);

  vendorBranches: VendorBranch[] = [];
  dataSource = new MatTableDataSource(this.vendorBranches);

  displayedColumns: string[] = [
    "name",
    "designation",
    "mobileNo",
    "emailId",
    "location",
    "action",
  ];
  VendorBranchForm: FormGroup;
  role: any;
  haveVendorBranch: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _registration: RegistrationService
  ) { }

  ngOnInit(): void {
    this.VendorBranchForm = this._fb.group({
      Name: ["", [Validators.required]],
      Designation: [""],
      Email_Id: ["", [Validators.required,
        Validators.pattern("^[a-z][a-z0-9._-]+@[a-z]+\\.[a-z]{2,3}$")]],
      Mobile_No: ["", [Validators.required, Validators.maxLength(15)]],
      Location: ["", [Validators.required]],
    });
    this.valueChangeEvents();

    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";
    this.role != 'Vendor' ? this.isVendorBranchRequired.disable() : this.isVendorBranchRequired.enable();
    // Get vendor branches by form Id
    this._registration.getFormData(this.form_Id, "VendorBranches").subscribe({
      next: (res) => {
        if (res) {
          this.vendorBranches = res;
          this.dataSource = new MatTableDataSource(this.vendorBranches);
          if (this.vendorBranches.length == 0) {
            this.haveVendorBranch = false;
            this.isVendorBranchRequired.setValue(false);
          }
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  // Allow (numbers, plus, and space) for Mobile & Phone
  keyPressValidation(event, type) {
    return this._commonService.KeyPressValidation(event, type);
  }

  addVendorBranch() {
    if (this.VendorBranchForm.valid) {
      this.dataSource.data.push(this.VendorBranchForm.value);
      this.dataSource._updateChangeSubscription();
      this.VendorBranchForm.reset();
    } else {
      this.VendorBranchForm.markAllAsTouched();
    }
  }

  removeVendorBranch(i: number) {
    this.dataSource.data.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // Make sure the vendorBranches array has at least one value
  isValid() {
    if (!this.isVendorBranchRequired.value || this.dataSource.data.length > 0) {
      return true;
    } else {
      console.log('vendor branches');
      this.VendorBranchForm.markAllAsTouched();
      this._commonService.openRequiredFieldsSnackbar();
      return false;
    }
  }

  // Get vendorBranches array, calls by layout component
  getVendorBranches() {
    this.vendorBranches = this.dataSource.data as VendorBranch[];
    this.vendorBranches.forEach((element) => {
      element.Branch_Id = element.Branch_Id ? element.Branch_Id : 0;
      element.Form_Id = this.form_Id;
    });
    return this.vendorBranches;
  }

  // To enable/disable vendor branches form
  valueChangeEvents() {
    this.isVendorBranchRequired.valueChanges.subscribe({
      next: (res) => {
        if (res)
          this.haveVendorBranch = true;
        else {
          this.haveVendorBranch = false;
          this.dataSource.data = [];
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }
  
  markVendorBranchFormAsTouched(){
    if(this.dataSource.data.length == 0){
      this.VendorBranchForm.markAllAsTouched();
    }
  }
}
