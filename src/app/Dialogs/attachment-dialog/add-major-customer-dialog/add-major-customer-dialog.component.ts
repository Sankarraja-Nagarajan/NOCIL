import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MajorCustomer, NocilRelatedEmployee } from '../../../Models/Dtos';
import { CommonService } from '../../../Services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-add-major-customer-dialog',
  templateUrl: './add-major-customer-dialog.component.html',
  styleUrls: ['./add-major-customer-dialog.component.scss']
})
export class AddMajorCustomerDialogComponent implements OnInit {

  majorCustomerForm: FormGroup;
  majorCustomers: MajorCustomer[] = [];
  nocilRelatedEmployeeForm: FormGroup;
  nocilRelatedEmployees : NocilRelatedEmployee[]=[];
  headingTag:string;
  form_Id: number;

  constructor(private _common: CommonService,
    private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<AddMajorCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    if (this.data.type == 'Major Customer') {
      // major Customer Form initialization
      this.majorCustomerForm = this._fb.group({
        Customer_Name: ['', [Validators.required]],
        Location: ['', [Validators.required]],
      });
      this.headingTag = 'Major Customer';
    }

    if (this.data.type == 'Nocil Member') {
      // major Customer Form initialization
      this.nocilRelatedEmployeeForm = this._fb.group({
        Employee_Name: ['', [Validators.required]],
        Type_Of_Relation: ['', [Validators.required]],
      });
      this.headingTag = 'Related NOCIL Employee';
    }

    this.form_Id = this.data.form_Id;
  }

  //add item into majorCustomers array
  addMajorCustomer() {
    if (this.majorCustomerForm.valid) {
      let majorCustomer = new MajorCustomer();
      majorCustomer = this.majorCustomerForm.value;
      majorCustomer.Id = 0;
      majorCustomer.Form_Id = this.form_Id;
      this.majorCustomers.push(majorCustomer);
      this.majorCustomerForm.reset();
    }
    else {
      this.majorCustomerForm.markAllAsTouched();
    }
  }

  //remove item into majorCustomers array
  removeMajorCustomer(index: number) {
    this.majorCustomers.splice(index, 1);
  }

  //add item into nocilRelatedEmployees array
  addNocilEmployee() {
    if (this.nocilRelatedEmployeeForm.valid) {
      let employee = new NocilRelatedEmployee();
      employee = this.nocilRelatedEmployeeForm.value as NocilRelatedEmployee;
      employee.Id = 0;
      employee.Form_Id = this.form_Id;
      this.nocilRelatedEmployees.push(employee);
      this.nocilRelatedEmployeeForm.reset();
    }
    else {
      this.nocilRelatedEmployeeForm.markAllAsTouched();
    }
  }

  //remove item into nocilRelatedEmployees array
  removeNocilEmployee(index: number) {
    this.nocilRelatedEmployees.splice(index, 1);
  }
}
