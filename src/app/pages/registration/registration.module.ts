import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { AddressComponent } from './address/address.component';
import { RegistrationFormLayoutComponent } from './registration-form-layout/registration-form-layout.component';
import { DomesticVendorPersonalInfoComponent } from './domestic-vendor-personal-info/domestic-vendor-personal-info.component';
import { ContactsComponent } from './contacts/contacts.component';
import { VendorBranchesComponent } from './vendor-branches/vendor-branches.component';
import { PartnersComponent } from './partners/partners.component';
import { AnnualTurnoverComponent } from './annual-turnover/annual-turnover.component';
import { TechnicalProfileComponent } from './technical-profile/technical-profile.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CommercialProfileComponent } from './commercial-profile/commercial-profile.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DomesticVendorOrgProfileComponent } from './domestic-vendor-org-profile/domestic-vendor-org-profile.component';
import { TransportVendorsPersonalDetailsComponent } from './transport-vendors-personal-details/transport-vendors-personal-details.component';
import { TankerDetailsComponent } from './tanker-details/tanker-details.component';
import { AuthGuard } from '../../Guards/auth.guard';



const routes: Routes = [
  {
    path: 'form',
    component: RegistrationFormLayoutComponent,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  declarations: [
    AddressComponent,
    RegistrationFormLayoutComponent,
    DomesticVendorPersonalInfoComponent,
    DomesticVendorOrgProfileComponent,
    ContactsComponent,
    VendorBranchesComponent,
    PartnersComponent,
    AnnualTurnoverComponent,
    TechnicalProfileComponent,
    AttachmentsComponent,
    CommercialProfileComponent,
    BankDetailsComponent,
    TransportVendorsPersonalDetailsComponent,
    TankerDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ]
})
export class RegistrationModule { }
