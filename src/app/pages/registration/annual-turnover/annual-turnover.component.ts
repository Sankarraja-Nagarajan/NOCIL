import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { AnnualTurnOver } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { RegistrationService } from "../../../Services/registration.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { getSession } from "../../../Utils";

@Component({
  selector: "ngx-annual-turnover",
  templateUrl: "./annual-turnover.component.html",
  styleUrls: ["./annual-turnover.component.scss"],
})
export class AnnualTurnoverComponent implements OnInit {
  @Input() form_Id: number;

  annualTurnOver: AnnualTurnOver[] = [];
  dataSource = new MatTableDataSource(this.annualTurnOver);
  displayedColumns: string[] = [
    "year",
    "salesturnover",
    "operatingprofit",
    "netprofit",
    "action",
  ];
  turnoverForm: FormGroup;
  years: number[] = [];
  role: string = "";
  editIndex: number = -1;

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _registration: RegistrationService
  ) {
    this.turnoverForm = _fb.group({
      Year: ["", Validators.required],
      SalesTurnOver: [0, Validators.required],
      OperatingProfit: [0],
      NetProfit: [0],
    });
  }
  ngOnInit(): void {
    this.generateYears();

    // Get Annual turn overs data by form Id
    this._registration.getFormData(this.form_Id, "AnnualTurnOvers").subscribe({
      next: (res) => {
        if (res) {
          this.annualTurnOver = res;
          this.dataSource = new MatTableDataSource(this.annualTurnOver);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });

    const userData = JSON.parse(getSession("userDetails"));
    this.role = userData ? userData.Role : "";
  }

  addTurnover() {
    if (this.turnoverForm.valid) {
      const salesTurnover = this.turnoverForm.get("SalesTurnOver").value;
      if (salesTurnover <= 0) {
        this.turnoverForm.get('SalesTurnOver').setErrors({ 'incorrect': true });
        this._commonService.openSnackbar("Please fill the Sales Turnover above 0", snackbarStatus.Warning);
        return;
      }

      this.dataSource.data.push(this.turnoverForm.value);
      this.dataSource._updateChangeSubscription();
      this.turnoverForm.reset();
      this.turnoverForm.get("SalesTurnOver").setValue(0);
      this.turnoverForm.get("OperatingProfit").setValue(0);
      this.turnoverForm.get("NetProfit").setValue(0);

    } else {
      this.turnoverForm.markAllAsTouched();
    }
  }

  updateTurnOver() {
    if (this.editIndex >= 0) {
      let id = this.dataSource.data[this.editIndex].TurnOver_Id;
      this.dataSource.data[this.editIndex] = this.turnoverForm.value;
      this.dataSource.data[this.editIndex].TurnOver_Id = id;
      this.dataSource._updateChangeSubscription();
      this.turnoverForm.reset();
      this.editIndex = -1;
    }
  }

  removeTurnover(i) {
    this.dataSource.data.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  editTurnover(i: number) {
    this.turnoverForm.patchValue(this.dataSource.data[i]);
    this.editIndex = i;
  }

  //generate last 5 years for year
  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
  }

  //validations
  keyPressValidation(event: Event, type: string) {
    return this._commonService.KeyPressValidation(event, type);
  }

  // Make sure the annualTurnOver array has at least one value
  isValid() {
    if (this.dataSource.data.length > 0) {
      return true;
    } else {
      this.turnoverForm.markAllAsTouched();
      this._commonService.openRequiredFieldsSnackbar();
      return false;
    }
  }

  // Get annualTurnOver array, calls by layout component
  getAnnualTurnOvers() {
    this.annualTurnOver = this.dataSource.data as AnnualTurnOver[];
    this.annualTurnOver.forEach((element) => {
      element.TurnOver_Id = element.TurnOver_Id ? element.TurnOver_Id : 0;
      element.Form_Id = this.form_Id;
    });
    return this.annualTurnOver;
  }

  markTurnOverFormAsTouched() {
    if (this.dataSource.data.length == 0) {
      this.turnoverForm.markAllAsTouched();
    }
  }
}
