import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { Contact } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { LoginService } from "../../../Services/login.service";
import { ContactType } from "../../../Models/Master";
import { MasterService } from "../../../Services/master.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";

@Component({
  selector: "ngx-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"],
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  dataSource = new MatTableDataSource(this.contacts);

  displayedColumns: string[] = [
    "contactTypeId",
    "name",
    "designation",
    "phoneNo",
    "emailId",
    "mobileNo",
    "action",
  ];
  contactForm: FormGroup;
  form_Id: number;
  contactTypes: ContactType[] = [];
  role: string = "";

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _master: MasterService
  ) {}

  ngOnInit(): void {
    // contact form Initialization
    this.contactForm = this._fb.group({
      Contact_Type_Id: ["", [Validators.required]],
      Name: ["", [Validators.required]],
      Designation: [""],
      Email_Id: ["", [Validators.required, Validators.email]],
      Phone_Number: ["", [Validators.maxLength(15)]],
      Mobile_Number: ["", [Validators.maxLength(15)]],
    });

    // get Form Id from session storage
    this.form_Id = parseInt(sessionStorage.getItem("Form_Id"));
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";

    // get contact types
    this._master.getContactTypes().subscribe({
      next: (res) => {
        if (res) {
          this.contactTypes = res as ContactType[];
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

  // Add contact to the table
  addContact() {
    if (this.contactForm.valid) {
      this.contacts.push(this.contactForm.value);
      this.dataSource._updateChangeSubscription();
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  // Remove contact from table
  removeContact(i: number) {
    this.contacts.splice(i, 1);
    this.dataSource._updateChangeSubscription();
  }

  // Make sure the contacts array has at least one value
  isValid() {
    if (this.contacts.length > 0) {
      return true;
    } else {
      this.contactForm.markAllAsTouched();
      return false;
    }
  }

  // Get contacts array, calls by layout component
  getContacts() {
    this.contacts.forEach((element) => {
      element.Contact_Id = 0;
      element.Form_Id = this.form_Id;
    });
    return this.contacts;
  }

  getContactTypeById(contactTypeId: number): string {
    const type = this.contactTypes.find(
      (type) => type.Contact_Type_Id === contactTypeId
    );
    return type ? type.Contact_Type : "";
  }
}
