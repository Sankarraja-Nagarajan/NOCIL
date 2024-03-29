import { Component, OnInit, ViewChild } from "@angular/core";
import { AddressComponent } from "../address/address.component";
import { DomesticAndImportForm } from "../../../Models/DomesticAndImportForm";
import { ContactsComponent } from "../contacts/contacts.component";
import { PartnersComponent } from "../partners/partners.component";
import { AnnualTurnoverComponent } from "../annual-turnover/annual-turnover.component";
import { VendorBranchesComponent } from "../vendor-branches/vendor-branches.component";
import { DomesticVendorPersonalInfoComponent } from "../domestic-vendor-personal-info/domestic-vendor-personal-info.component";
import { BankDetailsComponent } from "../bank-details/bank-details.component";
import { CommercialProfileComponent } from "../commercial-profile/commercial-profile.component";
import { TechnicalProfileComponent } from "../technical-profile/technical-profile.component";
import { DomesticVendorOrgProfileComponent } from "../domestic-vendor-org-profile/domestic-vendor-org-profile.component";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { TransportForm } from "../../../Models/TransportForm";
import { TransportVendorsPersonalDetailsComponent } from "../transport-vendors-personal-details/transport-vendors-personal-details.component";
import { TankerDetailsComponent } from "../tanker-details/tanker-details.component";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { RegistrationService } from "../../../Services/registration.service";
import {
  Approval,
  FormSubmitTemplate,
  Rejection,
} from "../../../Models/Registration";
import { AuthResponse } from "../../../Models/authModel";
import { MatDialog } from "@angular/material/dialog";
import { TermsAndConditionsDialogComponent } from "../../../Dialogs/attachment-dialog/terms-and-conditions-dialog/terms-and-conditions-dialog.component";
import { AttachmentsComponent } from "../attachments/attachments.component";
import { RejectReasonDialogComponent } from "../../../Dialogs/reject-reason-dialog/reject-reason-dialog.component";
import { ServiceForm } from "../../../Models/ServiceForm";

@Component({
  selector: "ngx-registration-form-layout",
  templateUrl: "./registration-form-layout.component.html",
  styleUrls: ["./registration-form-layout.component.scss"],
})
export class RegistrationFormLayoutComponent implements OnInit {
  @ViewChild(AddressComponent) addressComponent: AddressComponent;
  @ViewChild(ContactsComponent) contactsComponent: ContactsComponent;
  @ViewChild(PartnersComponent) partnersComponent: PartnersComponent;
  @ViewChild(AnnualTurnoverComponent)
  annualTurnoverComponent: AnnualTurnoverComponent;
  @ViewChild(VendorBranchesComponent)
  vendorBranchesComponent: VendorBranchesComponent;
  @ViewChild(DomesticVendorPersonalInfoComponent)
  domesticVendorPersonalInfoComponent: DomesticVendorPersonalInfoComponent;
  @ViewChild(BankDetailsComponent) bankDetailsComponent: BankDetailsComponent;
  @ViewChild(CommercialProfileComponent)
  commercialProfileComponent: CommercialProfileComponent;
  @ViewChild(TechnicalProfileComponent)
  technicalProfileComponent: TechnicalProfileComponent;
  @ViewChild(DomesticVendorOrgProfileComponent)
  domesticVendorOrgProfileComponent: DomesticVendorOrgProfileComponent;
  @ViewChild(TransportVendorsPersonalDetailsComponent)
  transportVendorsPersonalDetailsComponent: TransportVendorsPersonalDetailsComponent;
  @ViewChild(TankerDetailsComponent)
  tankerDetailsComponent: TankerDetailsComponent;
  @ViewChild(AttachmentsComponent)
  attachmentsComponent: AttachmentsComponent;

  form_Id: number = 1;
  v_Id: number = 1;
  authResponse: AuthResponse;
  form_status: string;
  isReadOnly: boolean = true;
  loader: boolean = false;

  // boolean variables to show or hide child components
  personalData: boolean = false;
  transportPersonalData: boolean = false;
  address: boolean = false;
  tankerDetails: boolean = false;
  contact: boolean = false;
  organizationData: boolean = false;
  proprietorOrPartner: boolean = false;
  annualTurnOver: boolean = false;
  technicalProfile: boolean = false;
  attachments: boolean = false;
  bankDetails: boolean = false;
  commercialProfile: boolean = false;
  vendorBranches: boolean = false;

  constructor(
    private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private _registration: RegistrationService,
    private _dialog: MatDialog,
    private _router: Router
  ) { }
  ngOnInit(): void {
    this.authResponse = JSON.parse(sessionStorage.getItem("userDetails"));
    this._activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params != null && params["data"] != null) {
          const JSON_DATA = JSON.parse(params["data"]);
          this.form_Id = JSON_DATA.Form_Id;
          this.v_Id = JSON_DATA.V_Id;
          this.form_status = JSON_DATA.Status;
          console.log(JSON_DATA);
          this.selectFormBasedOnVendorType(this.v_Id);
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });

    if (this.authResponse?.Role === "Vendor") {
      this.isReadOnly = false;
      //
      this.openTermsAndConditionsDialog();
    }
  }

  //#region Open terms and Conditions dialog
  openTermsAndConditionsDialog() {
    const dialogRef = this._dialog.open(TermsAndConditionsDialogComponent, {
      autoFocus: false,
      disableClose: true,
      width: "700px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
        } else {
          this.openTermsAndConditionsDialog();
        }
      },
    });
  }
  //#endregion

  //#region Submittinerfg form API Call
  submitForm(formSubmitTemplate: FormSubmitTemplate) {
    this.loader = true;
    this._registration.formSubmit(formSubmitTemplate).subscribe({
      next: (res) => {
        console.log(res);
        if (res.Status === 200) {
          this.loader = false;
          this._commonService.openSnackbar(res.Message, snackbarStatus.Success);
          this._router.navigate(["/auth/otp"]);
        }
      },
      error: (err) => {
        this.loader = false;
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }
  //#endregion

  //#region Updating form API call
  updateForm(formSubmitTemplate: FormSubmitTemplate) {
    this.loader = true;
    this._registration.formSubmit(formSubmitTemplate).subscribe({
      next: (res) => {
        console.log(res);
        if (res.Status === 200) {
          this.loader = false;
          this._commonService.openSnackbar(res.Message, snackbarStatus.Success);
          this._router.navigate(["/auth/otp"]);
        }
      },
      error: (err) => {
        this.loader = false;
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }
  //#endregion

  //#region Calling corresponding submit/update functions based on vendor type
  submit(event: Event) {
    event.preventDefault();
    if (this.v_Id === 1) {
      this.domesticAndImportFormSubmit();
    } else if (this.v_Id == 2) {
      this.serviceFormSubmit();
    } else if (this.v_Id === 3) {
      this.transportFormSubmit();
    } else if (this.v_Id == 4) {
      this.domesticAndImportFormSubmit();
    }
  }

  update(event: Event) {
    event.preventDefault();
    if (this.v_Id === 1) {
      this.domesticAndImportFormSubmit();
    } else if (this.v_Id === 2) {
      this.transportFormSubmit();
    }
    // else if (this.v_Id == 4) {
    //   this.domesticAndImportFormPayload();
    // }
  }
  //#endregion

  // Rejection dialog and API call
  openRejectDialog() {
    const DIALOF_REF = this._dialog.open(RejectReasonDialogComponent, {
      disableClose: true,
      width: "400px",
      height: "220px",
      data: this.form_Id,
    });
    DIALOF_REF.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.loader = true;
          this._registration.formRejection(res.reject as Rejection).subscribe({
            next: (res) => {
              this.loader = false;
              if (res && res.Status == 200) {
                this._commonService.openSnackbar(
                  res.Message,
                  snackbarStatus.Success
                );
                this._router.navigate(["/onboarding/dashboard"]);
              }
            },
            error: (err) => {
              this.loader = false;
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }
  // Approval API call
  approveForm(event: Event) {
    event.preventDefault();
    let approval = new Approval();
    approval.Form_Id = this.form_Id;
    approval.VendorTypeId = this.v_Id;
    approval.EmployeeId = this.authResponse.Employee_Id;
    approval.RoleId = this.authResponse?.Role_Id;
    approval.RoleName = this.authResponse?.Role;
    approval.RmEmployeeId = this.authResponse.RmEmployee_Id;
    approval.RmRoleId = this.authResponse.RmRole_Id;
    approval.RmRoleName = this.authResponse.RmRole;
    this.loader = true;
    this._registration.formApproval(approval).subscribe({
      next: (res) => {
        this.loader = false;
        if (res && res.Status == 200) {
          this._commonService.openSnackbar(res.Message, snackbarStatus.Success);
          this._router.navigate(["/onboarding/dashboard"]);
        }
      },
      error: (err) => {
        this.loader = false;
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  //#region Submit function call based on Vendor Type
  domesticAndImportFormSubmit() {
    if (this.checkValidationForDomestic()) {
      var payload = this.createDomesticAndImportPayload();
      if (this.form_status == "Initiated") {
        this.submitForm(payload);
      } else if (this.form_status == "Rejected") {
        this.updateForm(payload);
      } else {
        this._commonService.openSnackbar(
          `You can not submit the ${this.form_status} form`,
          snackbarStatus.Danger
        );
      }
    } else {
      this.markAllFormsAsTouched();
    }
  }

  transportFormSubmit() {
    if (this.checkValidationForTransport()) {
      var payload = this.createTransportPayload();
      if (this.form_status == "Initiated") {
        this.submitForm(payload);
      } else if (this.form_status == "Rejected") {
        this.updateForm(payload);
      } else {
        this._commonService.openSnackbar(
          `You can not submit the ${this.form_status} form`,
          snackbarStatus.Danger
        );
      }
    } else {
      this.markAllFormsAsTouched();
    }
  }

  serviceFormSubmit(){
    if (this.checkValidationForService()) {
      var payload = this.createServicePayload();
      if (this.form_status == "Initiated") {
        this.submitForm(payload);
      } else if (this.form_status == "Rejected") {
        this.updateForm(payload);
      } else {
        this._commonService.openSnackbar(
          `You can not submit the ${this.form_status} form`,
          snackbarStatus.Danger
        );
      }
    } else {
      this.markAllFormsAsTouched();
    }
  }
  //#endregion

  //#region Validation based on form
  checkValidationForDomestic() {
    return (
      this.domesticVendorPersonalInfoComponent.isValid() &&
      this.domesticVendorOrgProfileComponent.isValid() &&
      this.commercialProfileComponent.isValid() &&
      this.bankDetailsComponent.isValid() &&
      this.addressComponent.isValid() &&
      this.contactsComponent.isValid() &&
      this.vendorBranchesComponent.isValid() &&
      (!this.proprietorOrPartner || this.partnersComponent?.isValid()) &&
      this.annualTurnoverComponent.isValid() &&
      this.attachmentsComponent.isValid()
    );
  }

  checkValidationForTransport() {
    return (
      this.transportVendorsPersonalDetailsComponent.isValid() &&
      this.tankerDetailsComponent.isValid() &&
      this.bankDetailsComponent.isValid() &&
      this.commercialProfileComponent.isValid() &&
      this.vendorBranchesComponent.isValid()
    );
  }

  checkValidationForService() {
    return (
      this.domesticVendorPersonalInfoComponent.isValid() &&
      this.domesticVendorOrgProfileComponent.isValid() &&
      this.commercialProfileComponent.isValid() &&
      this.bankDetailsComponent.isValid() &&
      this.addressComponent.isValid() &&
      this.contactsComponent.isValid() &&
      this.vendorBranchesComponent.isValid() &&
      (!this.proprietorOrPartner || this.partnersComponent?.isValid()) &&
      this.attachmentsComponent.isValid()
    );
  }
  //#endregion

  //#region Payload formation methods
  createDomesticAndImportPayload(): FormSubmitTemplate {
    let domesticAndImportForm = new DomesticAndImportForm();
    domesticAndImportForm.VendorPersonalData =
      this.domesticVendorPersonalInfoComponent.getDomesticVendorPersonalInfo();
    domesticAndImportForm.VendorOrganizationProfile =
      this.domesticVendorOrgProfileComponent.getDomesticVendorOrgProfile();
    domesticAndImportForm.TechnicalProfile =
      this.technicalProfileComponent.getTechnicalProfile();
    domesticAndImportForm.Subsideries =
      this.domesticVendorOrgProfileComponent.getSubsideries();
    domesticAndImportForm.MajorCustomers =
      this.domesticVendorOrgProfileComponent.getMajorCustomers();
    domesticAndImportForm.CommercialProfile =
      this.commercialProfileComponent.getCommercialProfile();
    domesticAndImportForm.BankDetail =
      this.bankDetailsComponent.getBankDetail();
    domesticAndImportForm.Addresses = this.addressComponent.getAddresses();
    domesticAndImportForm.Contacts = this.contactsComponent.getContacts();
    domesticAndImportForm.VendorBranches =
      this.vendorBranchesComponent.getVendorBranches();
    domesticAndImportForm.ProprietorOrPartners = this.partnersComponent
      ? this.partnersComponent.getProprietorOrPartners()
      : [];
    domesticAndImportForm.AnnualTurnOvers =
      this.annualTurnoverComponent.getAnnualTurnOvers();
    domesticAndImportForm.NocilRelatedEmployees =
      this.domesticVendorOrgProfileComponent.getNocilRelatedEmployees();
    return this.createFormSubmitTemplate(domesticAndImportForm);
  }

  createTransportPayload(): FormSubmitTemplate {
    let transportForm = new TransportForm();
    transportForm.TransportVendorPersonalData =
      this.transportVendorsPersonalDetailsComponent.getTransportVendorPersonalData();
    transportForm.TankerDetails =
      this.tankerDetailsComponent.getTankerDetails();
    transportForm.BankDetail = this.bankDetailsComponent.getBankDetail();
    transportForm.CommercialProfile =
      this.commercialProfileComponent.getCommercialProfile();
    transportForm.VendorBranches =
      this.vendorBranchesComponent.getVendorBranches();
    return this.createFormSubmitTemplate(transportForm);
  }

  createServicePayload(): FormSubmitTemplate {
    let serviceForm = new ServiceForm();
    serviceForm.VendorPersonalData =
      this.domesticVendorPersonalInfoComponent.getDomesticVendorPersonalInfo();
      serviceForm.VendorOrganizationProfile =
      this.domesticVendorOrgProfileComponent.getDomesticVendorOrgProfile();
      serviceForm.TechnicalProfile =
      this.technicalProfileComponent.getTechnicalProfile();
      serviceForm.Subsideries =
      this.domesticVendorOrgProfileComponent.getSubsideries();
      serviceForm.MajorCustomers =
      this.domesticVendorOrgProfileComponent.getMajorCustomers();
      serviceForm.CommercialProfile =
      this.commercialProfileComponent.getCommercialProfile();
      serviceForm.BankDetail =
      this.bankDetailsComponent.getBankDetail();
      serviceForm.Addresses = this.addressComponent.getAddresses();
      serviceForm.Contacts = this.contactsComponent.getContacts();
      serviceForm.VendorBranches =
      this.vendorBranchesComponent.getVendorBranches();
      serviceForm.ProprietorOrPartners = this.partnersComponent
      ? this.partnersComponent.getProprietorOrPartners()
      : [];
      serviceForm.NocilRelatedEmployees =
      this.domesticVendorOrgProfileComponent.getNocilRelatedEmployees();
    return this.createFormSubmitTemplate(serviceForm);
  }
  //#endregion

  // Create final payload structure to submit or update form
  createFormSubmitTemplate(data: any): FormSubmitTemplate {
    let formSubmitTemplate = new FormSubmitTemplate();
    formSubmitTemplate.Vendor_Type_Id = this.v_Id;
    formSubmitTemplate.Form_Id = this.form_Id;
    formSubmitTemplate.FormData = data;
    return formSubmitTemplate;
  }

  // Selecting the child form components to display in the template based on the vendor type
  selectFormBasedOnVendorType(vId: number) {
    switch (vId) {
      case 1:
        this.personalData = true;
        this.address = true;
        this.contact = true;
        this.organizationData = true;
        this.proprietorOrPartner = true;
        this.annualTurnOver = true;
        this.technicalProfile = true;
        this.attachments = true;
        this.bankDetails = true;
        this.commercialProfile = true;
        this.vendorBranches = true;
        break;
      case 2:
        this.personalData = true;
        this.organizationData = true;
        this.technicalProfile = true;
        this.commercialProfile = true;
        this.bankDetails = true;
        this.address = true;
        this.contact = true;
        this.proprietorOrPartner = true;
        this.attachments = true;
        this.vendorBranches = true;
        break;
      case 3:
        this.transportPersonalData = true;
        this.tankerDetails = true;
        this.address = true;
        this.contact = true;
        this.attachments = true;
        this.bankDetails = true;
        this.commercialProfile = true;
        this.vendorBranches = true;
        break;
      case 4:
        this.personalData = true;
        this.address = true;
        this.contact = true;
        this.organizationData = true;
        this.proprietorOrPartner = true;
        this.annualTurnOver = true;
        this.technicalProfile = true;
        this.attachments = true;
        this.bankDetails = true;
        this.commercialProfile = true;
        this.vendorBranches = true;
        break;
    }
  }

  // Emitter functions
  getCompanyStatus(event) {
    this.proprietorOrPartner = event;
  }

  // mark all forms as touched
  markAllFormsAsTouched() {
    this.addressComponent?.markAddressFormAsTouched();
    this.contactsComponent?.markContactFormAsTouched();
    this.partnersComponent?.markPartnersFormAsTouched();
    this.annualTurnoverComponent?.markTurnOverFormAsTouched();
    this.vendorBranchesComponent?.markVendorBranchFormAsTouched();
    this.domesticVendorPersonalInfoComponent?.domesticVendorForm.markAllAsTouched();
    this.bankDetailsComponent?.bankDetailsForm.markAllAsTouched();
    this.commercialProfileComponent?.commercialProfileForm.markAllAsTouched();
    this.technicalProfileComponent?.technicalProfileForm.markAllAsTouched();
    this.domesticVendorOrgProfileComponent?.vendorOrgForm.markAllAsTouched();
    this.transportVendorsPersonalDetailsComponent?.transporterVendorsForm.markAllAsTouched();
    this.tankerDetailsComponent?.markTankerDetailFormAsTouched();
  }

  // reset all forms
  resetAllForms() {
    this.addressComponent.addressForm.reset();
    this.contactsComponent.contactForm.reset();
    this.partnersComponent.partnersForm.reset();
    this.annualTurnoverComponent.turnoverForm.reset();
    this.vendorBranchesComponent.VendorBranchForm.reset();
    this.domesticVendorPersonalInfoComponent.domesticVendorForm.reset();
    this.bankDetailsComponent.bankDetailsForm.reset();
    this.commercialProfileComponent.commercialProfileForm.reset();
    this.technicalProfileComponent.technicalProfileForm.reset();
    this.domesticVendorOrgProfileComponent.vendorOrgForm.reset();
    this.transportVendorsPersonalDetailsComponent.transporterVendorsForm.reset();
    this.tankerDetailsComponent.TankerDetailsForm.reset();
  }
}
